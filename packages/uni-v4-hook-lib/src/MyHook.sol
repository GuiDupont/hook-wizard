// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {BaseHook} from "v4-periphery/BaseHook.sol";

import "./fees/BumpingFees.sol";
import "./access/Whitelist.sol";

// 0****************************************************0
// | This hook has been generated using Hooks-Wizzard ! |
// 0****************************************************0

contract MyHook is BaseHook, BumpingFees, Whitelist {
    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {
        startTimestamp = block.timestamp;
    }

    function getHookPermissions()
        public
        pure
        override(BaseHook, Whitelist, BumpingFees)
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: true,
                afterInitialize: true,
                beforeAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterAddLiquidity: false,
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

    function beforeInitialize(
        address sender,
        PoolKey memory key,
        uint160 sqrtPriceX96,
        bytes calldata hookData
    ) public override(Whitelist, BaseHook) returns (bytes4) {
        return Whitelist.beforeInitialize(sender, key, sqrtPriceX96, hookData);
    }

    function beforeSwap(
        address sender,
        PoolKey memory key,
        IPoolManager.SwapParams memory params,
        bytes calldata hookData
    )
        public
        view
        override(Whitelist, BaseHook, BumpingFees)
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        address user = abi.decode(hookData, (address));
        if (whitelist[user] == false) revert OnlyWhitelistedUsers();
        return BumpingFees.beforeSwap(sender, key, params, hookData);
    }

    function afterInitialize(
        address sender,
        PoolKey memory key,
        uint160 sqrtPriceX96,
        int24 tick,
        bytes calldata hookData
    ) public override(BumpingFees, BaseHook) returns (bytes4) {
        return
            BumpingFees.afterInitialize(
                sender,
                key,
                sqrtPriceX96,
                tick,
                hookData
            );
    }

    function afterSwap(
        address sender,
        PoolKey memory key,
        IPoolManager.SwapParams memory params,
        BalanceDelta delta,
        bytes calldata hookData
    ) public override(BumpingFees, BaseHook) returns (bytes4, int128) {
        return BumpingFees.afterSwap(sender, key, params, delta, hookData);
    }
}
