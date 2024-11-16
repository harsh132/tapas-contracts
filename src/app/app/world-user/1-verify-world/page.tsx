"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { useMiniKitContext } from "~/components/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useTapasStore } from "~/components/tapas-provider";
import { Check } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { motion } from "motion/react";
import { appComponentVariants, pageVariants } from "../../motion-pages";
import { useTransitionState } from "next-transition-router";
import { useMutation, useQuery } from "@tanstack/react-query";

const VerifyWorld = () => {
  const [_, setTapInProgress] = useLocalStorage("progress", false);
  const { isMiniKitSuccess } = useMiniKitContext();

  const worldAddress = useTapasStore((s) => s.worldAddress);
  const setWorldAddress = useTapasStore((s) => s.setWorldAddress);

  const {
    mutate: signInWithWorld,
    isPending,
    error,
    data: signInMutationData,
  } = useMutation({
    mutationKey: ["sign in with world"],
    mutationFn: async () => {
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

      if (finalPayload.status === "error") {
        return false;
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
          const walletAddress = MiniKit.walletAddress;
          setWorldAddress(walletAddress!);

          return true;
        }
      }
    },
  });

  return (
    <motion.div
      variants={pageVariants}
      key={"verify-world"}
      className="flex h-full w-full flex-col gap-4"
    >
      <motion.div variants={appComponentVariants} className="header">
        <h1 className="tapas-gradient-text pt-16 text-center text-4xl font-bold">
          Verify your world ID
        </h1>

        <p className="mt-8 text-center">Tapas is hungry for your world id 😋</p>

        {!!worldAddress && (
          <div className="mt-16 flex w-full justify-center gap-4 text-xl text-green-500">
            Verified! <Check />
          </div>
        )}
      </motion.div>

      <motion.div
        variants={appComponentVariants}
        className="mb-4 mt-auto flex h-24 w-full flex-col gap-4 text-center"
      >
        {signInMutationData ? (
          <Button
            onClick={() => {
              setTapInProgress(true);
              window.open(
                `https://redirect-tapas-world.vercel.app/redirect?redirect=${encodeURIComponent(window.origin + `/app/world-user/2-verify-nfc`)}`,
                "_system",
              );
            }}
            className="tapas-gradient h-24"
          >
            Connect Your Band
          </Button>
        ) : (
          <Button className="h-24" onClick={() => signInWithWorld()}>
            {isPending ? "Verifying" : "Verify World ID"}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VerifyWorld;
