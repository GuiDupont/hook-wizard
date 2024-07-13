export const IHookAbi = [
  {
    type: "function",
    name: "afterAddLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          {
            name: "liquidityDelta",
            type: "int256",
            internalType: "int256",
          },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "delta", type: "int256", internalType: "BalanceDelta" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int256", internalType: "BalanceDelta" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterDonate",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      { name: "amount0", type: "uint256", internalType: "uint256" },
      { name: "amount1", type: "uint256", internalType: "uint256" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterInitialize",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "sqrtPriceX96",
        type: "uint160",
        internalType: "uint160",
      },
      { name: "tick", type: "int24", internalType: "int24" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterRemoveLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          {
            name: "liquidityDelta",
            type: "int256",
            internalType: "int256",
          },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "delta", type: "int256", internalType: "BalanceDelta" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int256", internalType: "BalanceDelta" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterSwap",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.SwapParams",
        components: [
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "amountSpecified",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
      { name: "delta", type: "int256", internalType: "BalanceDelta" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int128", internalType: "int128" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeAddLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          {
            name: "liquidityDelta",
            type: "int256",
            internalType: "int256",
          },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeDonate",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      { name: "amount0", type: "uint256", internalType: "uint256" },
      { name: "amount1", type: "uint256", internalType: "uint256" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeInitialize",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "sqrtPriceX96",
        type: "uint160",
        internalType: "uint160",
      },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeRemoveLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          {
            name: "liquidityDelta",
            type: "int256",
            internalType: "int256",
          },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeSwap",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          {
            name: "currency0",
            type: "address",
            internalType: "Currency",
          },
          {
            name: "currency1",
            type: "address",
            internalType: "Currency",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          {
            name: "hooks",
            type: "address",
            internalType: "contract IHooks",
          },
        ],
      },
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.SwapParams",
        components: [
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          {
            name: "amountSpecified",
            type: "int256",
            internalType: "int256",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int256", internalType: "BeforeSwapDelta" },
      { name: "", type: "uint24", internalType: "uint24" },
    ],
    stateMutability: "nonpayable",
  },
] as const;
