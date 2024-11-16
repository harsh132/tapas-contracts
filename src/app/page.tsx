/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useMiniKitContext } from "~/components/minikit-provider";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { env } from "~/env";
import { MiniKit } from "@worldcoin/minikit-js";
import { Button } from "~/components/ui/button";

// import {} from "@worldcoin/minikit-react";
export default function HomePage() {
  const { isMiniKitSuccess } = useMiniKitContext();
  return (
    <>
      <main className="h-screen px-4">
        <h1 className="pt-32 text-center text-2xl">Welcome to Tapas!</h1>

        <div>Minikit - {String(isMiniKitSuccess)}</div>
        <div>Address - {MiniKit.walletAddress}</div>

        <Button onClick={signInWithWallet}>Sign In</Button>

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

const signInWithWallet = async () => {
  if (!MiniKit.isInstalled()) {
    return;
  }

  const res = await fetch(`/api/nonce`);
  const { nonce } = await res.json();

  const { commandPayload: generateMessageResult, finalPayload } =
    await MiniKit.commandsAsync.walletAuth({
      nonce: nonce,
      requestId: "0", // Optional
      expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      statement:
        "This is my statement and here is a link https://worldcoin.com/apps",
    });

  if (finalPayload.status === "error") {
    return;
  } else {
    const response = await fetch("/api/complete-siwe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: finalPayload,
        nonce,
      }),
    });

    console.log(response);
  }
};
