import { coinbaseWallet } from "wagmi/connectors";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, celo, mainnet, worldchain } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, base, celo, worldchain],
  transports: {
    [mainnet.id]: http(),
    [worldchain.id]: http(),
    [base.id]: http(),
    [celo.id]: http(),
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
