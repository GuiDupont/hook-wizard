// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook, LPFeeLibrary, Hooks, IPoolManager, PoolKey, PoolId, PoolIdLibrary, BalanceDelta, BeforeSwapDelta, BeforeSwapDeltaLibrary} from "../BaseHook.sol";


error OnlyOwner();
error OnlyWhitelistedUsers();

abstract contract Whitelist is BaseHook {
    using PoolIdLibrary for PoolKey;

    mapping(address => bool) public whitelist;
    address public owner;

    // NOTE: ---------------------------------------------------------
    // state variables should typically be unique to a pool
    // a single hook contract should be able to service multiple pools
    // ---------------------------------------------------------------

    function addToWhitelist(address _address) external {
        if (msg.sender != owner) revert OnlyOwner();
        whitelist[_address] = true;
    }

    function removeFromWhitelist(address _address) external {
        if (msg.sender != owner) revert OnlyOwner();
        whitelist[_address] = false;
    }

    function getHookPermissions()
        public
        pure
        virtual
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: true,
                afterInitialize: false,
                beforeAddLiquidity: false,
                afterAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: true,
                afterSwap: false,
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
        bytes calldata hookData
    ) public view virtual override returns (bytes4, BeforeSwapDelta, uint24) {
        address user = abi.decode(hookData, (address));
        if (whitelist[user] == false) revert OnlyWhitelistedUsers();
        return (
            BaseHook.beforeSwap.selector,
            BeforeSwapDeltaLibrary.ZERO_DELTA,
            0
        );
    }

    function beforeInitialize(
        address,
        PoolKey memory,
        uint160,
        bytes calldata hookData
    ) public virtual override returns (bytes4) {
        owner = abi.decode(hookData, (address));
        return (BaseHook.beforeInitialize.selector);
    }
}