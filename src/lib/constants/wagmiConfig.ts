import { coinbaseWallet } from "wagmi/connectors";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import {
  base,
  baseSepolia,
  celo,
  mainnet,
  worldchain,
  worldchainSepolia,
} from "wagmi/chains";

export const wagmiconfig = createConfig({
  chains: [base, worldchain, baseSepolia, worldchainSepolia],
  transports: {
    [worldchain.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [worldchainSepolia.id]: http(),
  },
});

export function getConfig() {
  return createConfig({
    chains: [base], // add baseSepolia for testing
    connectors: [
      coinbaseWallet({
        appName: "OnchainKit",
        preference: "smartWalletOnly",
        version: "4",
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(), // add baseSepolia for testing
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
