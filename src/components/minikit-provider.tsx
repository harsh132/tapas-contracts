"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { env } from "~/env";
import { useUtapiaStore } from "./utapia-provider";

export const MiniKitContext = createContext<{
  isMiniKitSuccess: boolean;
}>({
  isMiniKitSuccess: false,
});

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isMiniKitSuccess, setIsMiniKitSuccess] = useState(false);
  const setMode = useUtapiaStore((state) => state.setMode);
  useEffect(() => {
    // Passing appId in the install is optional
    // but allows you to access it later via `window.MiniKit.appId`

    MiniKit.install(env.NEXT_PUBLIC_WORLD_APP_ID);
    setIsMiniKitSuccess(MiniKit.isInstalled());
    setMode(MiniKit.isInstalled() ? "world" : "external");
  }, [setMode]);

  return (
    <MiniKitContext.Provider value={{ isMiniKitSuccess }}>
      {children}
    </MiniKitContext.Provider>
  );
}

export const useMiniKitContext = () => useContext(MiniKitContext);
