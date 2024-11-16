"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";

import { shortenAddress } from "~/lib/utils";
import { useMiniKitContext } from "~/components/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";

const VerifyWorld = () => {
  const [success, setSuccess] = useState(false);
  const { isMiniKitSuccess } = useMiniKitContext();
  const [walletAddress, setWalletAddress] = useState("");
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
        setWalletAddress(walletAddress!);
      }
    }
  };

  return (
    <>
      <div className="header text-background">
        <h1 className="tapas-gradient-text pt-16 text-center text-4xl font-bold">
          Verify your world ID -{String(isMiniKitSuccess)}
          {String(MiniKit?.isInstalled())}
        </h1>
      </div>

      <div className="mb-8 mt-auto flex w-full flex-col gap-4 text-center">
        {success ? (
          <Button disabled={true}>
            {`Connected to World ID. Proceed`} <br />
            {shortenAddress(walletAddress ?? "")}
          </Button>
        ) : (
          <Button onClick={signInWithWallet}>Verify World ID</Button>
        )}
      </div>
    </>
  );
};

export default VerifyWorld;
