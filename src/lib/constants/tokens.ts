import { base, baseSepolia, worldchain, worldchainSepolia } from "viem/chains";
import { Token } from "../types";

export const NATIVE = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const TOKENS: Record<number, Record<string, Token>> = {
  [worldchain.id]: {
    "0x79a02482a880bce3f13e09da970dc34db4cd24d1": {
      name: "Bridged USDC",
      symbol: "USDC",
      decimals: 6,
      address: "0x79a02482a880bce3f13e09da970dc34db4cd24d1",
      price: 1,
      chainId: 480,
    },
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      price: 3100,
      chainId: 480,
    },
  },
  [base.id]: {
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": {
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      price: 1,
      chainId: 8453,
    },
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      price: 3100,
      chainId: 8453,
    },
  },

  // TESTNETS
  [worldchainSepolia.id]: {
    "0x79a02482a880bce3f13e09da970dc34db4cd24d1": {
      name: "Bridged USDC",
      symbol: "USDC",
      decimals: 6,
      address: "0x79a02482a880bce3f13e09da970dc34db4cd24d1",
      price: 1,
      chainId: 4801,
    },
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      price: 3100,
      chainId: 4801,
    },
  },

  [baseSepolia.id]: {
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": {
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      price: 1,
      chainId: 84532,
    },
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      price: 3100,
      chainId: 84532,
    },
  },
};
