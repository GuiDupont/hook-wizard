import { BaseFunction, ContractBuilder } from "../contract";
import { BaseHook } from "./baseHook";
import { ERC20Options } from "./hook";
import { functions } from "./functions";
import { getBaseHookPermissions, hookPermissions } from "./hookPermissions";
const Whitelist = {
  name: "Whitelist",
  path: "../hooks/access/Whitelist.sol",
};

// WHITELIST HOOKS
export function computeWhitelistPermissions(
  opts: ERC20Options
): hookPermissions {
  const permission = getBaseHookPermissions();
  permission.beforeInitialize = opts.whitelistHook || false;
  permission.beforeSwap = opts.whitelistHook || false;
  return permission;
}

export function whitelistHookOverrides(c: ContractBuilder) {
  c.addOverride(BaseHook, functions.getHookPermissions);
  c.addOverride(Whitelist, functions.getHookPermissions);

  c.addOverride(Whitelist, functions.beforeInitialize);
  c.addOverride(BaseHook, functions.beforeInitialize);

  c.addOverride(Whitelist, functions.beforeSwap);
  c.addOverride(BaseHook, functions.beforeSwap);
}

export function getHookFunctionsCode(): {
  body: string;
  function: BaseFunction;
  visibility?: "view" | "pure" | "nonpayable" | "payable" | undefined;
}[] {
  const beforeInit = {
    body: "return Whitelist.beforeInitialize(sender, key, sqrtPriceX96, hookData);",
    function: functions.beforeInitialize,
  };
  const beforeSwap = {
    body: "return Whitelist.beforeSwap(sender, key, params, hookData);",
    function: functions.beforeSwap,
  };
  return [beforeInit, beforeSwap];
}

export function feeWhitelistConstructor(c: ContractBuilder) {
  c.addParent(Whitelist);
}

export function addWhitelistHook(c: ContractBuilder) {
  whitelistHookOverrides(c);
  feeWhitelistConstructor(c);
  const functions = getHookFunctionsCode();
  for (const func of functions) {
    c.setFunctionBody([func.body], func.function);
  }
}
