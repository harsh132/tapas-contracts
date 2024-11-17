export type Network = {
  chainId: string;
  name: string;
  rpcUrls: string[];
}
export const networks: Record<string, Network> = {
  "11155111": {
    chainId: "11155111",
    name: "sepolia",
    rpcUrls: [
      'https://sepolia.drpc.org',
      'https://1rpc.io/sepolia',
      'https://rpc.sepolia.org',
      'https://eth-sepolia.public.blastapi.io'
    ],
  },
  "4801": {
    chainId: "4801",
    name: "world sepolia",
    rpcUrls: [
      'https://4801.rpc.thirdweb.com',
      'https://worldchain-sepolia.gateway.tenderly.co',
      'https://worldchain-sepolia.g.alchemy.com/public'
    ],
  },
  "84532": {
    chainId: "84532",
    name: "base sepolia",
    rpcUrls: [
      'https://base-sepolia-rpc.publicnode.com',
      'https://base-sepolia.gateway.tenderly.co',
      'https://sepolia.base.org',
      'https://base-sepolia.blockpi.network/v1/rpc/public'
    ],
  },
  '44787': {
    chainId: '44787',
    name: 'alfajores',
    rpcUrls: [
      'https://alfajores-forno.celo-testnet.org'
    ]
  }
};