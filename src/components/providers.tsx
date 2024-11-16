"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { getConfig } from "~/lib/constants/wagmiConfig";
import MiniKitProvider from "./minikit-provider";
import { base } from "viem/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config} initialState={props.initialState}>
        <MiniKitProvider>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
          >
            {props.children}
          </OnchainKitProvider>
        </MiniKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default Providers;
