import { getBalances } from "~/lib/actions/getChainBalances";
import { type UseQueryResult, useQueries } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { base, worldchain } from "viem/chains";
import { useAccount } from "wagmi";
import { useUtapiaStore } from "~/components/utapia-provider";
import { TOKENS } from "~/lib/constants/tokens";
import useTokenBalanceStore from "./useTokenBalanceStore";

const useTokenBalances = () => {
  const mode = useUtapiaStore((s) => s.mode);
  const utapiaAddress = useUtapiaStore((s) => s.utapiaAddress);
  const wagmiAddress = useAccount();
  let address = (
    mode === "world" ? utapiaAddress : wagmiAddress
  ) as `0x${string}`;
  address = "0x0b90994f83d2fde68f83c418141b42550de2cb4c";

  const setChainBalances = useTokenBalanceStore(
    (state) => state.setChainBalances,
  );
  const resetChainBalances = useTokenBalanceStore((state) => state.reset);

  const combineResults = useCallback(
    (
      results: UseQueryResult<
        { chainId: string; balances: Record<string, string> },
        Error
      >[],
    ) => {
      return {
        data: results
          .filter((result) => result.data)
          .map((result) => result.data) as {
          chainId: string;
          balances: Record<string, string>;
        }[],
        pending: results.some((result) => result.isPending),
      };
    },
    [],
  );

  const { data: chainBalances } = useQueries({
    queries: Object.keys(TOKENS).map((chainId) => ({
      queryKey: ["balances", chainId, address],
      enabled: Boolean(TOKENS[Number(chainId)] && address),
      queryFn: async () =>
        ({
          chainId,
          balances: await getBalances(
            Object.values(TOKENS[Number(chainId)] ?? {}),
            chainId === "8453" ? base : worldchain,
            address,
          ),
        }) as { chainId: string; balances: Record<string, string> },
      refetchInterval: 15 * 1000, // 15 seconds
      refetchOnWindowFocus: false,
    })),

    combine: combineResults,
  });

  useEffect(() => {
    if (!chainBalances) {
      resetChainBalances();
      return;
    }

    for (const chainBalance of chainBalances) {
      setChainBalances(chainBalance?.chainId, chainBalance?.balances);
    }
  }, [setChainBalances, chainBalances, resetChainBalances]);
};

export default useTokenBalances;
