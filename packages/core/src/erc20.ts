import { Contract, ContractBuilder } from "./contract";
import {
  Access,
  setAccessControl,
  requireAccessControl,
} from "./set-access-control";
import { addPauseFunctions } from "./add-pausable";
import { defineFunctions } from "./utils/define-functions";
import {
  CommonOptions,
  withCommonDefaults,
  defaults as commonDefaults,
} from "./common-options";
import { printContract } from "./print";
import { ClockMode, clockModeDefault, setClockMode } from "./set-clock-mode";

interface hookPermissions {
  beforeInitialize: boolean;
  afterInitialize: boolean;
  beforeAddLiquidity: boolean;
  beforeRemoveLiquidity: boolean;
  afterAddLiquidity: boolean;
  afterRemoveLiquidity: boolean;
  beforeSwap: boolean;
  afterSwap: boolean;
  beforeDonate: boolean;
  afterDonate: boolean;
  beforeSwapReturnDelta: boolean;
  afterSwapReturnDelta: boolean;
  afterAddLiquidityReturnDelta: boolean;
  afterRemoveLiquidityReturnDelta: boolean;
}

export interface ERC20Options extends CommonOptions {
  name: string;
  symbol: string;
  burnable?: boolean;
  pausable?: boolean;
  premint?: string;
  mintable?: boolean;
  permit?: boolean;
  whitelistHook?: boolean;
  bumpingFeeHook?: boolean;

  /**
   * Whether to keep track of historical balances for voting in on-chain governance, and optionally specify the clock mode.
   * Setting `true` is equivalent to 'blocknumber'. Setting a clock mode implies voting is enabled.
   */
  votes?: boolean | ClockMode;
  flashmint?: boolean;
}

export const defaults: Required<ERC20Options> = {
  name: "MyHook",
  symbol: "MTK",
  burnable: false,
  pausable: false,
  premint: "0",
  mintable: false,
  permit: true,
  votes: false,
  flashmint: false,
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  info: commonDefaults.info,
  whitelistHook: false,
  bumpingFeeHook: false,
} as const;

function withDefaults(opts: ERC20Options): Required<ERC20Options> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    burnable: opts.burnable ?? defaults.burnable,
    pausable: opts.pausable ?? defaults.pausable,
    premint: opts.premint || defaults.premint,
    mintable: opts.mintable ?? defaults.mintable,
    permit: opts.permit ?? defaults.permit,
    votes: opts.votes ?? defaults.votes,
    flashmint: opts.flashmint ?? defaults.flashmint,
    whitelistHook: opts.whitelistHook ?? defaults.whitelistHook,
    bumpingFeeHook: opts.bumpingFeeHook ?? defaults.bumpingFeeHook,
  };
}

export function printERC20(opts: ERC20Options = defaults): string {
  return printContract(buildERC20(opts));
}

export function isAccessControlRequired(opts: Partial<ERC20Options>): boolean {
  return opts.mintable || opts.pausable || opts.upgradeable === "uups";
}

export function buildERC20(opts: ERC20Options): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  const { info } = allOpts;

  addBase(c, allOpts.name, allOpts.symbol);

  if (allOpts.bumpingFeeHook) {
    addBumpingFeeHook(c);
  }

  addHookPermissions(c, allOpts);
  // addHookPermissionsOverrides(c, allOpts);

  return c;
}

function addHookPermissions(c: ContractBuilder, opts: ERC20Options) {
  c.setFunctionBody(
    [getHookPermissionsCode(opts)],
    functions.getHookPermissions,
    "pure"
  );
}

// bumping fees before swap after sawap and after init

function computeHookPermissions(opts: ERC20Options): hookPermissions {
  // const whitelist = opts.whitelistHook ? ["swapBefore"] : [];
  const bumpingFees = computeBumpingFeePermissions(opts);
  return bumpingFees;
}

function getHookPermissionsCode(opts: ERC20Options) {
  const permissions = computeHookPermissions(opts);
  return `
         return Hooks.Permissions({
            beforeInitialize: ${permissions.beforeInitialize},
            afterInitialize: ${permissions.afterInitialize},
            beforeAddLiquidity: ${permissions.beforeAddLiquidity},
            beforeRemoveLiquidity: ${permissions.beforeRemoveLiquidity},
            afterAddLiquidity: ${permissions.afterAddLiquidity},
            afterRemoveLiquidity: ${permissions.afterRemoveLiquidity},
            beforeSwap: ${permissions.beforeSwap},
            afterSwap: ${permissions.afterSwap},
            beforeDonate: ${permissions.beforeDonate},
            afterDonate: ${permissions.afterDonate},
            beforeSwapReturnDelta: ${permissions.beforeSwapReturnDelta},
            afterSwapReturnDelta: ${permissions.afterSwapReturnDelta},
            afterAddLiquidityReturnDelta: ${permissions.afterAddLiquidityReturnDelta},
            afterRemoveLiquidityReturnDelta: ${permissions.afterRemoveLiquidityReturnDelta}
        } );
    `;
}

function computeBumpingFeePermissions(opts: ERC20Options): hookPermissions {
  return {
    beforeInitialize: opts.bumpingFeeHook || false,
    afterInitialize: false,
    beforeAddLiquidity: false,
    beforeRemoveLiquidity: false,
    afterAddLiquidity: false,
    afterRemoveLiquidity: false,
    beforeSwap: opts.bumpingFeeHook || false,
    afterSwap: opts.bumpingFeeHook || false,
    beforeDonate: false,
    afterDonate: false,
    beforeSwapReturnDelta: false,
    afterSwapReturnDelta: false,
    afterAddLiquidityReturnDelta: false,
    afterRemoveLiquidityReturnDelta: false,
  };
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
  const BaseHook = {
    name: "BaseHook",
    path: "../hooks/BaseHook.sol",
  };
  c.addParent(BaseHook);
}

// function addWhitelistHook(c: ContractBuilder) {
//   c.addParent({
//     name: "Whitelist",
//     path: "../hooks/access/Whitelist.sol",
//   });
//   // c.addFunctionCode("return _balances[account];", functions._update);
// }

function addBumpingFeeHook(c: ContractBuilder) {
  const BumpingFee = {
    name: "BumpingFee",
    path: "../hooks/fee/BumpingFee.sol",
  };
  const BaseHook = {
    name: "BaseHook",
  };
  const functionArg = {
    type: "IPoolManager",
    name: "_poolManager",
  };

  c.addConstructorArgument(functionArg);

  c.addParent(BumpingFee, [{ lit: "_poolManager" }]);
  c.addOverride(BumpingFee, functions.getHookPermissions);
  c.addOverride(BaseHook, functions.getHookPermissions);

  c.addFunctionCode(
    "return BumpingFee.afterInitialize(sender, key, sqrtPriceX96, tick, hookData);",
    functions.afterInitialize
  );

  c.addOverride(BumpingFee, functions.afterInitialize);
  c.addOverride(BaseHook, functions.afterInitialize);

  c.addOverride(BumpingFee, functions.beforeSwap);
  c.addOverride(BaseHook, functions.beforeSwap);
  console.log(functions.beforeSwap);

  c.setFunctionBody(
    ["return BumpingFee.beforeSwap(sender, key, params, hookData);"],
    functions.beforeSwap,
    "view"
  );
  console.log(functions.beforeSwap);
  // c.addFunctionCode(
  //   "return BumpingFee.beforeSwap(sender, key, params, hookData);",
  //   functions.beforeSwap
  // );

  c.addFunctionCode(
    "return BumpingFee.afterSwap(sender, key, params, delta, hookData);",
    functions.afterSwap
  );
  c.addOverride(BumpingFee, functions.afterSwap);
  c.addOverride(BaseHook, functions.afterSwap);
}

const functions = defineFunctions({
  getHookPermissions: {
    kind: "public" as const,
    args: [],
    returns: ["Hooks.Permissions memory"],
  },

  beforeInitialize: {
    kind: "public" as const,
    args: [
      { name: "sender", type: "address" },
      {
        name: "key",
        type: "PoolKey memory",
        // internalType: "struct PoolKey memory",
      },
      {
        name: "sqrtPriceX96",
        type: "uint160",
        // internalType: "uint160",
      },
      { name: "hookData", type: "bytes calldata" },
    ],
    returns: ["bytes4"],
  },
  afterInitialize: {
    kind: "public" as const,
    args: [
      { name: "sender", type: "address" },
      {
        name: "key",
        type: "PoolKey memory",
        // internalType: "struct PoolKey memory",
      },
      {
        name: "sqrtPriceX96",
        type: "uint160",
        // internalType: "uint160",
      },
      { name: "tick", type: "int24" },
      { name: "hookData", type: "bytes calldata" },
    ],
    returns: ["bytes4"],
  },

  //    returns (int256 amountToSwap, BeforeSwapDelta hookReturn, uint24 lpFeeOverride)
  beforeSwap: {
    kind: "public" as const,
    mutability: "view" as const,
    args: [
      { name: "sender", type: "address" },
      {
        name: "key",
        type: "PoolKey memory",
        // internalType: "struct PoolKey memory",
      },
      {
        name: "params",
        type: "IPoolManager.SwapParams memory",
        // internalType: "struct IPoolManager.SwapParams memory",
      },
      { name: "hookData", type: "bytes calldata" },
    ],
    returns: ["bytes4", "BeforeSwapDelta", "uint24"],
  },

  afterSwap: {
    kind: "public" as const,
    args: [
      { name: "sender", type: "address" },
      {
        name: "key",
        type: "PoolKey memory",
        // internalType: "struct PoolKey memory",
      },
      {
        name: "params",
        type: "IPoolManager.SwapParams memory",
        // internalType: "struct IPoolManager.SwapParams memory",
      },
      {
        name: "delta",
        type: "BalanceDelta",
        // internalType: "struct BalanceDelta memory",
      },
      { name: "hookData", type: "bytes calldata" },
    ],
    returns: ["bytes4", "int128"],
  },

  nonces: {
    kind: "public" as const,
    args: [{ name: "owner", type: "address" }],
    returns: ["uint256"],
    mutability: "view" as const,
  },
});

function addVotes(c: ContractBuilder, clockMode: ClockMode) {
  if (!c.parents.some((p) => p.contract.name === "ERC20Permit")) {
    throw new Error("Missing ERC20Permit requirement for ERC20Votes");
  }

  const ERC20Votes = {
    name: "ERC20Votes",
    path: "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol",
  };
  c.addParent(ERC20Votes);
  // c.addOverride(ERC20Votes, functions._update);
  c.addOverride(
    {
      name: "Nonces",
    },
    functions.nonces
  );

  setClockMode(c, ERC20Votes, clockMode);
}

function getBeforeSwapWhitelist(c: ContractBuilder) {
  return `address user = abi.decode(hookData, (address));
        if (whitelist[user] == false) revert OnlyWhitelistedUsers();
        return (
            BaseHook.beforeSwap.selector,
            BeforeSwapDeltaLibrary.ZERO_DELTA,
            0
        );`;
}
