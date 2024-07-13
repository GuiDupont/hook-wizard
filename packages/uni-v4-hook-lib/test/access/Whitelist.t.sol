// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {BaseHook} from "v4-periphery/BaseHook.sol";
import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";
import {LPFeeLibrary} from "v4-core/src/libraries/LPFeeLibrary.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {Deployers} from "v4-core/test/utils/Deployers.sol";
import {Whitelist, OnlyOwner, OnlyWhitelistedUsers} from "../../src/access/Whitelist.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";

contract WhitelistHook is Whitelist {
    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}
}

contract WhitelistTest is Test, Deployers {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using StateLibrary for IPoolManager;

    Vm.Wallet user1 = vm.createWallet("user1");
    Vm.Wallet user2 = vm.createWallet("user2");
    Vm.Wallet owner = vm.createWallet("owner");

    WhitelistHook hook;
    PoolId poolId;

    function setUp() public {
        // creates the pool manager, utility routers, and test tokens
        Deployers.deployFreshManagerAndRouters();
        Deployers.deployMintAndApprove2Currencies();

        // Deploy the hook to an address with the correct flags
        address flags = address(
            uint160(Hooks.BEFORE_SWAP_FLAG | Hooks.BEFORE_INITIALIZE_FLAG) ^
                (0x4444 << 144) // Namespace the hook to avoid collisions
        );
        deployCodeTo(
            "Whitelist.t.sol:WhitelistHook",
            abi.encode(manager),
            flags
        );

        hook = WhitelistHook(flags);

        // Create the pool
        key = PoolKey(
            currency0,
            currency1,
            LPFeeLibrary.DYNAMIC_FEE_FLAG,
            60,
            IHooks(hook)
        );
        poolId = key.toId();

        manager.initialize(key, SQRT_PRICE_1_1, abi.encode(owner.addr));

        // Provide full-range liquidity to the pool
        modifyLiquidityRouter.modifyLiquidity(
            key,
            IPoolManager.ModifyLiquidityParams(
                TickMath.minUsableTick(60),
                TickMath.maxUsableTick(60),
                10_000 ether,
                0
            ),
            ZERO_BYTES
        );
    }

    function testMustAllowWhitelistedUsers() public {
        assertEq(owner.addr, hook.owner());

        vm.prank(owner.addr);
        hook.addToWhitelist(user1.addr);

        assertEq(hook.whitelist(user1.addr), true);

        bool zeroForOne = true;
        int256 amountSpecified = -0.0001 ether; // negative number indicates exact input swap!
        BalanceDelta swapDelta = swap(
            key,
            zeroForOne,
            amountSpecified,
            abi.encode(user1.addr)
        );
    }

    function testMustForbidUnauthorizedUsers() public {
        assertEq(owner.addr, hook.owner());

        assertEq(hook.whitelist(user1.addr), false);

        bool zeroForOne = true;
        int256 amountSpecified = -0.0001 ether; // negative number indicates exact input swap!

        vm.expectRevert(OnlyWhitelistedUsers.selector);
        BalanceDelta swapDelta = swap(
            key,
            zeroForOne,
            amountSpecified,
            abi.encode(user1.addr)
        );
    }

    function testWhitelistingFeatures() public {
        assertEq(owner.addr, hook.owner());

        vm.prank(owner.addr);
        hook.addToWhitelist(user1.addr);

        vm.expectRevert(OnlyOwner.selector);
        hook.addToWhitelist(user2.addr);

        vm.expectRevert(OnlyOwner.selector);
        hook.removeFromWhitelist(user1.addr);

        vm.prank(owner.addr);
        hook.removeFromWhitelist(user1.addr);
    }
}
