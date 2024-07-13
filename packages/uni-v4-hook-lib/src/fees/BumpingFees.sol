// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/BaseHook.sol";

import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {LPFeeLibrary} from "v4-core/src/libraries/LPFeeLibrary.sol";

abstract contract BumpingFees is BaseHook {
    using PoolIdLibrary for PoolKey;

    uint256 public startTimestamp;

    // Start at 5% fee, decaying at rate of 0.00001% per second
    // after 495,000 seconds (5.72 days), fee will be a minimum of 0.05%
    // NOTE: because fees are uint24, we will lose some precision
    uint128 public constant START_FEE = 500000; // represents 5%
    uint128 public constant MIN_FEE = 500; // minimum fee of 0.05%

    uint128 public constant decayRate = 1; // 0.00001% per second

    // NOTE: ---------------------------------------------------------
    // state variables should typically be unique to a pool
    // a single hook contract should be able to service multiple pools
    // ---------------------------------------------------------------

    uint256 public constant FIXED_HOOK_FEE = 1;

    // constructor(IPoolManager _poolManager) BaseHook(_poolManager) {
    // }

    function getHookPermissions()
        public
        pure
        virtual
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: false,
                afterInitialize: true,
                beforeAddLiquidity: false,
                afterAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: true,
                afterSwap: true,
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    // -----------------------------------------------
    // NOTE: see IHooks.sol for function documentation
    // -----------------------------------------------

    function beforeSwap(
        address,
        PoolKey memory,
        IPoolManager.SwapParams memory,
        bytes calldata
    ) public view virtual override returns (bytes4, BeforeSwapDelta, uint24) {
        // Linearly decaying fee, y = mx + b
        // After 495,000 seconds (5.72 days), fee will be a minimum of 0.05%
        uint256 _currentFee;
        unchecked {
            uint256 timeElapsed = block.timestamp - startTimestamp;
            _currentFee = timeElapsed > 495000
                ? uint256(MIN_FEE)
                : (uint256(START_FEE) - (timeElapsed * decayRate)) / 10;
        }

        // to override the LP fee, its 2nd bit must be set for the override to apply
        uint256 overrideFee = _currentFee |
            uint256(LPFeeLibrary.OVERRIDE_FEE_FLAG);
        return (
            BaseHook.beforeSwap.selector,
            BeforeSwapDeltaLibrary.ZERO_DELTA,
            uint24(overrideFee)
        );
    }

    function afterInitialize(
        address,
        PoolKey memory key,
        uint160,
        int24,
        bytes calldata
    ) public virtual override returns (bytes4) {
        manager.updateDynamicLPFee(key, uint24(START_FEE));
        return BaseHook.afterInitialize.selector;
    }

    function afterSwap(
        address,
        PoolKey memory key,
        IPoolManager.SwapParams memory,
        BalanceDelta,
        bytes calldata
    ) public virtual override onlyByManager returns (bytes4, int128) {
        manager.updateDynamicLPFee(key, uint24(START_FEE));
        startTimestamp = block.timestamp;
        return (BaseHook.afterSwap.selector, 0);
    }
}
