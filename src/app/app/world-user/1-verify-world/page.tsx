"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";

import { shortenAddress } from "~/lib/utils";
import { useMiniKitContext } from "~/components/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useTapasStore } from "~/components/tapas-provider";
import { Check } from "lucide-react";

const VerifyWorld = () => {
  const [success, setSuccess] = useState(false);
  const { isMiniKitSuccess } = useMiniKitContext();

  const worldAddress = useTapasStore((s) => s.worldAddress);
  const setWorldAddress = useTapasStore((s) => s.setWorldAddress);

  const signInWithWallet = async () => {
    if (window && isMiniKitSuccess && !MiniKit?.isInstalled()) {
      window?.alert("Minikit not installed");
      return;
    }

    const res = await fetch(`/api/nonce`);
    const { nonce } = await res.json();

    const { commandPayload: generateMessageResult, finalPayload } =
      await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        requestId: "0", // Optional
        expirationTime: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: "Connect my world id with Tapas",
      });

    console.log(generateMessageResult, finalPayload);

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

      const data = (await response.json()) as {
        status: string;
        isValid: boolean;
        message: string;
      };

      console.log(data);

      if (data.status === "success") {
        setSuccess(true);
        const walletAddress = MiniKit.walletAddress;
        setWorldAddress(walletAddress!);
      }
    }
  };

  return (
    <>
      <div className="header">
        <h1 className="tapas-gradient-text pt-16 text-center text-4xl font-bold">
          Verify your world ID
        </h1>

        <p className="mt-8 text-center">Tapas is hungry for your world id 😋</p>

        {!!worldAddress && (
          <div className="mt-16 flex w-full justify-center gap-4 text-xl text-green-500">
            Verified! <Check />
          </div>
        )}
      </div>

      <Button
        className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        onClick={() => window.open("https://www.example.com", "_system")}
      >
        Deep link button
      </Button>

      <div className="mb-8 mt-auto flex h-24 w-full flex-col gap-4 text-center">
        {success ? (
          <Button
            onClick={() =>
              window.open(
                `${window.origin}/app/world-user/2-verify-nfc`,
                "_system",
              )
            }
            className="tapas-gradient"
          >
            Proceed
          </Button>
        ) : (
          <Button onClick={signInWithWallet}>Verify World ID</Button>
        )}
      </div>
    </>
  );
};

export default VerifyWorld;
