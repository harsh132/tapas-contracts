"use client";

import { useMiniKitContext } from "~/components/minikit-provider";

// import {} from "@worldcoin/minikit-react";
export default function HomePage() {
  const { isMiniKitSuccess } = useMiniKitContext();
  return (
    <>
      <main className="h-screen px-4">
        <h1 className="pt-32 text-center text-2xl">Welcome to Tapas!</h1>

        <div>Minikit - {String(isMiniKitSuccess)}</div>
      </main>
    </>
  );
}
