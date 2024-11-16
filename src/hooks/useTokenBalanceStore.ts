import { create } from "zustand";

type ChainBalances = Record<string, string>;

interface TokenStoreState {
  chainBalances: Record<string, ChainBalances>;
}
interface TokenBalanceStore extends TokenStoreState {
  setChainBalances: (chainId: string, balances: ChainBalances) => void;
  setBalance: (chainId: string, tokenAddress: string, balance: string) => void;
  getBalance: (chainId: string, tokenAddress: string) => string | undefined;
  reset: () => void;
}

const DEFAULT_STATE: TokenStoreState = {
  chainBalances: {},
};

const useTokenBalanceStore = create<TokenBalanceStore>()((set, get) => ({
  ...DEFAULT_STATE,
  setChainBalances: (chainId: string, balances: ChainBalances) => {
    return set((state) => ({
      chainBalances: {
        ...state.chainBalances,
        [chainId]: { ...state.chainBalances[chainId], ...balances },
      },
    }));
  },
  setBalance: (chainId: string, tokenAddress: string, balance: string) => {
    return set((state) => ({
      chainBalances: {
        ...state.chainBalances,
        [chainId]: { ...state.chainBalances[chainId], [tokenAddress]: balance },
      },
    }));
  },
  getBalance: (chainId: string, tokenAddress: string) => {
    return get().chainBalances[chainId]?.[tokenAddress];
  },
  reset: () => {
    set(DEFAULT_STATE);
  },
}));

export const getTokenBalance = (chainId: string, tokenAddress: string) => {
  return (
    useTokenBalanceStore.getState().getBalance(chainId, tokenAddress) ?? 0n
  );
};

export default useTokenBalanceStore;
