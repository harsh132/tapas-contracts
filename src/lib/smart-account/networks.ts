export type Network = {
  chainId: string;
  name: string;
  rpcUrl: string;
}
export const networks: Record<string, Network> = {
  "1": {
    chainId: "1",
    name: "mainnet",
    rpcUrl: 'https://mainnet.infura.io/v3/',
  },
  "480": {
    chainId: "480",
    name: "world",
    rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
  }
}