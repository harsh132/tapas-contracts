"use client"; // Required for Next.js

import { type ReactNode, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { env } from "~/env";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Passing appId in the install is optional
    // but allows you to access it later via `window.MiniKit.appId`
    MiniKit.install(env.NEXT_PUBLIC_WORLD_APP_ID);
  }, []);

  return <>{children}</>;
}
