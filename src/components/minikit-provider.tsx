"use client"; // Required for Next.js

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { env } from "~/env";

export const MiniKitContext = createContext<{
  isMiniKitSuccess: boolean;
  miniKit: typeof MiniKit | undefined;
}>({
  isMiniKitSuccess: false,
  miniKit: undefined,
});

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isMiniKitSuccess, setIsMiniKitSuccess] = useState(false);
  const [miniKit, setMiniKit] = useState<typeof MiniKit>();

  useEffect(() => {
    setMiniKit(MiniKit);
  }, []);

  useEffect(() => {
    if (!miniKit) return;
    // Passing appId in the install is optional
    // but allows you to access it later via `window.MiniKit.appId`

    miniKit.install(env.NEXT_PUBLIC_WORLD_APP_ID);
    setIsMiniKitSuccess(miniKit.isInstalled(true));
  }, [miniKit]);

  return (
    <MiniKitContext.Provider value={{ isMiniKitSuccess, miniKit }}>
      {children}
    </MiniKitContext.Provider>
  );
}

export const useMiniKitContext = () => useContext(MiniKitContext);
