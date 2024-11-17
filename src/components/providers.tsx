"use client";

import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { getConfig } from "~/lib/constants/wagmiConfig";
import MiniKitProvider from "./minikit-provider";
import { base } from "viem/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { env } from "~/env";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          projectId={env.NEXT_PUBLIC_CDP_PROJECT_ID}
          chain={base}
        >
          <RainbowKitProvider modalSize="compact">
            <MiniKitProvider>{props.children}</MiniKitProvider>
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
