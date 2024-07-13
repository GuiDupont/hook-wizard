import { BaseFunction, ContractBuilder } from "../contract";
import { ERC20Options } from "./hook";
import { getBaseHookPermissions, hookPermissions } from "./hookPermissions";
import { functions } from "./functions";
import { BaseHook } from "./baseHook";
const BumpingFee = {
  name: "BumpingFee",
  path: "../hooks/fee/BumpingFee.sol",
};

// BUMPING FEE HOOKS
export function computeBumpingFeePermissions(
  opts: ERC20Options
): hookPermissions {
  const permission = getBaseHookPermissions();
  permission.afterInitialize = opts.bumpingFeeHook || false;
  permission.beforeSwap = opts.bumpingFeeHook || false;
  permission.afterSwap = opts.bumpingFeeHook || false;
  return permission;
}

export function feeBumpingHookOverrides(c: ContractBuilder) {
  c.addOverride(BaseHook, functions.getHookPermissions);
  c.addOverride(BumpingFee, functions.getHookPermissions);

  c.addOverride(BumpingFee, functions.afterInitialize);
  c.addOverride(BaseHook, functions.afterInitialize);

  c.addOverride(BumpingFee, functions.beforeSwap);
  c.addOverride(BaseHook, functions.beforeSwap);

  c.addOverride(BumpingFee, functions.afterSwap);
  c.addOverride(BaseHook, functions.afterSwap);
}

export function feeBumpingConstructor(c: ContractBuilder) {
  c.addParent(BumpingFee);
  c.constructorCode.push("startTimestamp = block.timestamp;");
}

export function getHookFunctionsCode(): {
  body: string;
  function: BaseFunction;
  visibility?: "view" | "pure" | "nonpayable" | "payable" | undefined;
}[] {
  const afterInit = {
    body: "return BumpingFee.afterInitialize(sender, key, sqrtPriceX96, tick, hookData);",
    function: functions.afterInitialize,
  };
  const beforeSwap = {
    body: "return BumpingFee.beforeSwap(sender, key, params, hookData);",
    function: functions.beforeSwap,
    visibility: "view",
  };
  const afterSwap = {
    body: "return BumpingFee.afterSwap(sender, key, params, delta, hookData);",
    function: functions.afterSwap,
  };
  return [afterInit, beforeSwap, afterSwap];
}

export function addBumpingFeeHook(c: ContractBuilder) {
  feeBumpingConstructor(c);
  feeBumpingHookOverrides(c);
  const functions = getHookFunctionsCode();
  for (const func of functions) {
    c.setFunctionBody([func.body], func.function, func?.visibility);
  }
}
