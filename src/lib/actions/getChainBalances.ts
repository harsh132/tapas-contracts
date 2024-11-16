import { multicall } from "@wagmi/core";
import { Chain, erc20Abi, formatUnits, type Address as EVMAddress } from "viem";
import { areTokensEqual, NATIVE_ADDRESS } from "~/lib/utils";
import { wagmiconfig } from "../constants/wagmiConfig";

export const getBalances = async (
  tokens: { address: string; decimals: number }[],
  chain: Chain,
  account: string,
): Promise<Record<string, string>> => {
  const balancesMulticall = [];

  for (const token of tokens) {
    if (
      areTokensEqual(token.address, NATIVE_ADDRESS) &&
      chain.contracts?.multicall3
    ) {
      balancesMulticall.push({
        address: chain.contracts?.multicall3.address,
        functionName: "getEthBalance",
        abi: [
          {
            inputs: [
              { internalType: "address", name: "addr", type: "address" },
            ],
            name: "getEthBalance",
            outputs: [
              { internalType: "uint256", name: "balance", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
          },
        ] as const,
        args: [account],
      });
      continue;
    }
    balancesMulticall.push({
      address: token.address as EVMAddress,
      functionName: "balanceOf",
      abi: erc20Abi,
      args: [account],
    });
  }
  const balances = await multicall(wagmiconfig, {
    contracts: balancesMulticall,
    allowFailure: true,
    batchSize: 100,
    // @ts-expect-error:asd
    chainId: chain.id,
  }).then((res) =>
    res.reduce(
      (acc, value, index) => {
        acc[tokens[index]!.address] = formatUnits(
          BigInt(value.result ?? "0"),
          tokens[index]!.decimals,
        );
        return acc;
      },
      {} as Record<string, string>,
    ),
  );
  return balances;
};
