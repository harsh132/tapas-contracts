"use client";
import { useMutation } from "@tanstack/react-query";
import { MiniKit } from "@worldcoin/minikit-js";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useMiniKitContext } from "~/components/minikit-provider";
import { Button } from "~/components/ui/button";
import { useUtapiaStore } from "~/components/utapia-provider";
import { appComponentVariants, pageVariants } from "../../motion-pages";

const VerifyWorld = () => {
  const [_, setTapInProgress] = useLocalStorage("progress", false);
  const { isMiniKitSuccess } = useMiniKitContext();

  const ownerAddress = useUtapiaStore((s) => s.ownerAddress);
  const setOwnerAddress = useUtapiaStore((s) => s.setOwnerAddress);

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
        return false;
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
          statement: "Connect my world id with Utapia",
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
          setOwnerAddress(walletAddress!);

          return walletAddress;
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
        <h1 className="utapia-gradient-text pt-16 text-center text-4xl font-bold">
          Verify your world ID
        </h1>

        <p className="mb-12 mt-8 text-center">
          Utapia is hungry for your world id
        </p>

        <div className="flex w-full justify-center">
          <img className="h-32 w-32 rounded-lg" src="/faces/wink.svg" alt="" />
        </div>

        {!!ownerAddress && (
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
                `https://redirect-utapia-world.vercel.app/redirect?redirect=${encodeURIComponent(window.origin + `/app/world-user/2-verify-nfc?ownerAddr=${ownerAddress}`)}`,
                "_system",
              );
            }}
            className="utapia-gradient h-24"
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
