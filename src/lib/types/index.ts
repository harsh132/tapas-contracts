export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  price?: number;
  chainId: number;
};
