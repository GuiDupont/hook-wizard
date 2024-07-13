import { Contract, ContractBuilder } from "../contract";
import {
  CommonOptions,
  withCommonDefaults,
  defaults as commonDefaults,
} from "../common-options";
import { printContract } from "../print";
import { ClockMode, clockModeDefault, setClockMode } from "../set-clock-mode";
import { functions } from "./functions";
import { hookPermissions } from "./hookPermissions";
import {
  addBumpingFeeHook,
  computeBumpingFeePermissions,
  feeBumpingConstructor,
  feeBumpingHookOverrides,
  getHookFunctionsCode as getHookFunctionsCodeFee,
} from "./feeBumping";
import {
  addWhitelistHook,
  computeWhitelistPermissions,
  whitelistHookOverrides,
  getHookFunctionsCode as getHookFunctionsCodeWhitelist,
  feeWhitelistConstructor,
} from "./whitelist";
import { BaseHook } from "./baseHook";

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

export function buildERC20(opts: ERC20Options): Contract {
  const allOpts = withDefaults(opts);

  const c = new ContractBuilder(allOpts.name);

  addHookPermissions(c, allOpts);
  addBase(c, allOpts.name, allOpts.symbol);

  if (allOpts.bumpingFeeHook && allOpts.whitelistHook) {
    whitelistHookOverrides(c);
    feeBumpingHookOverrides(c);
    feeBumpingConstructor(c);
    feeWhitelistConstructor(c);
    getHookFunctionsCodeFee()
      .filter((info) => info.function != functions.beforeSwap)
      .forEach((func) => {
        c.setFunctionBody([func.body], func.function, func?.visibility);
      });
    getHookFunctionsCodeWhitelist()
      .filter((info) => info.function != functions.beforeSwap)
      .forEach((func) => {
        c.setFunctionBody([func.body], func.function, func?.visibility);
      });
    c.setFunctionBody(
      [
        `
        address user = abi.decode(hookData, (address));
        if (whitelist[user] == false) revert OnlyWhitelistedUsers();
        return BumpingFee.beforeSwap(sender, key, params, hookData);`,
      ],
      functions.beforeSwap,
      "view"
    );
  } else if (allOpts.bumpingFeeHook) {
    addBumpingFeeHook(c);
  } else if (allOpts.whitelistHook) {
    addWhitelistHook(c);
  }

  return c;
}

function addHookPermissions(c: ContractBuilder, opts: ERC20Options) {
  c.setFunctionBody(
    [getHookPermissionsCode(opts)],
    functions.getHookPermissions,
    "pure"
  );
  c.addOverride(BaseHook, functions.getHookPermissions);
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
  c.addConstructorArgument({
    type: "IPoolManager",
    name: "_poolManager",
  });
  c.addParent(BaseHook, [{ lit: "_poolManager" }]);
}

function computeHookPermissions(opts: ERC20Options): hookPermissions {
  const bumpingFees = computeBumpingFeePermissions(opts);
  const whitelist = computeWhitelistPermissions(opts);
  const hookPermissions = [bumpingFees, whitelist];
  return hookPermissions.reduce((acc, curr) => {
    return {
      beforeInitialize: acc.beforeInitialize || curr.beforeInitialize,
      afterInitialize: acc.afterInitialize || curr.afterInitialize,
      beforeAddLiquidity: acc.beforeAddLiquidity || curr.beforeAddLiquidity,
      beforeRemoveLiquidity:
        acc.beforeRemoveLiquidity || curr.beforeRemoveLiquidity,
      afterAddLiquidity: acc.afterAddLiquidity || curr.afterAddLiquidity,
      afterRemoveLiquidity:
        acc.afterRemoveLiquidity || curr.afterRemoveLiquidity,
      beforeSwap: acc.beforeSwap || curr.beforeSwap,
      afterSwap: acc.afterSwap || curr.afterSwap,
      beforeDonate: acc.beforeDonate || curr.beforeDonate,
      afterDonate: acc.afterDonate || curr.afterDonate,
      beforeSwapReturnDelta:
        acc.beforeSwapReturnDelta || curr.beforeSwapReturnDelta,
      afterSwapReturnDelta:
        acc.afterSwapReturnDelta || curr.afterSwapReturnDelta,
      afterAddLiquidityReturnDelta:
        acc.afterAddLiquidityReturnDelta || curr.afterAddLiquidityReturnDelta,
      afterRemoveLiquidityReturnDelta:
        acc.afterRemoveLiquidityReturnDelta ||
        curr.afterRemoveLiquidityReturnDelta,
    };
  });
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

export function printERC20(opts: ERC20Options = defaults): string {
  return printContract(buildERC20(opts));
}

export function isAccessControlRequired(opts: Partial<ERC20Options>): boolean {
  return opts.mintable || opts.pausable || opts.upgradeable === "uups";
}
