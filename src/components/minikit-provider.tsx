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

export const MiniKitContext = createContext({
  isMiniKitSuccess: false,
});

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isMiniKitSuccess, setIsMiniKitSuccess] = useState(false);
  useEffect(() => {
    // Passing appId in the install is optional
    // but allows you to access it later via `window.MiniKit.appId`
    MiniKit.install(env.NEXT_PUBLIC_WORLD_APP_ID);
    setIsMiniKitSuccess(MiniKit.isInstalled(true));
  }, []);

  return (
    <MiniKitContext.Provider value={{ isMiniKitSuccess }}>
      {children}
    </MiniKitContext.Provider>
  );
}

export const useMiniKitContext = () => useContext(MiniKitContext);
