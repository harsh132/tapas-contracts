/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useMiniKitContext } from "~/components/minikit-provider";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { env } from "~/env";
import { MiniKit } from "@worldcoin/minikit-js";
import { Button } from "~/components/ui/button";
import Link from "next/link";

// import {} from "@worldcoin/minikit-react";
export default function HomePage() {
  const { isMiniKitSuccess } = useMiniKitContext();
  return (
    <>
      <main className="h-screen px-4">
        <h1 className="pt-32 text-center text-2xl">Welcome to Tapas!</h1>

        <Link
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          href="/hardware"
        >
          Hardware page
        </Link>

        <div>Minikit - {String(isMiniKitSuccess)}</div>
        <div>Address - {MiniKit.walletAddress}</div>

        <IDKitWidget
          app_id={env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`} // obtained from the Developer Portal
          action="vote_1" // this is your action id from the Developer Portal
          onSuccess={(s) => {
            console.log("success", s);
          }} // callback when the modal is closed
          handleVerify={(c) => {
            console.log("verify", c);
          }} // optional callback when the proof is received
          verification_level={VerificationLevel.Device}
        >
          {({ open }) => <button onClick={open}>Verify with World ID</button>}
        </IDKitWidget>
      </main>
    </>
  );
}
