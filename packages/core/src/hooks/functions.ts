import { defineFunctions } from "../utils/define-functions";
export const functions = defineFunctions({
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
      },
      {
        name: "sqrtPriceX96",
        type: "uint160",
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
      },
      {
        name: "sqrtPriceX96",
        type: "uint160",
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
