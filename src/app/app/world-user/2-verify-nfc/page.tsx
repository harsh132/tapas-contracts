"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as halo from "src/lib/halo";
import { useLocalStorage } from "usehooks-ts";
import * as viem from "viem";
import { useUtapiaStore } from "~/components/utapia-provider";
import { Button } from "~/components/ui/button";
import { appComponentVariants, pageVariants } from "../../motion-pages";

const VerifyNFC = () => {
  const utapiaAddress = useUtapiaStore((state) => state.utapiaAddress);
  const router = useRouter();
  const [tapInProgress, setTapInProgress] = useLocalStorage("progress", false);

  const searchParams = useSearchParams();
  const ownerAddr = searchParams.get("owner");

  useEffect(() => {
    if (utapiaAddress) {
      router.push("/app/home");
    }

    if (tapInProgress) {
      setTapInProgress(false);
      router.push("/app/home");
    }
  }, [tapInProgress, router, setTapInProgress, utapiaAddress]);

  const { data: nfcPerms, isLoading: isNfcPermsLoading } = useQuery({
    queryKey: ["nfc perms"],
    queryFn: async () => await halo.checkPermission().then(() => true),
  });

  const {
    data: nfcData,
    isPending,
    error: nfcError,
    mutate,
  } = useMutation({
    mutationKey: ["tap nfc"],
    mutationFn: async () => {
      const nfcAddress = await halo.getKey();
      if (!nfcAddress) {
        throw new Error("Could not scan the NFC");
      }

      await fetch("/api/deployer", {
        body: JSON.stringify({
          chain: 480,
          owner: ownerAddr,
          signers: [nfcAddress],
        }),
      });

      return true;
    },
  });

  return (
    <motion.div
      variants={pageVariants}
      key={"verify-nfc"}
      className="flex h-full w-full flex-col gap-4"
    >
      <motion.div variants={appComponentVariants} className="header">
        <h1 className="utapia-gradient-text pt-16 text-center text-4xl font-bold">
          Add your Wrist Band
        </h1>

        {nfcPerms ? (
          <p className="mt-8 text-center">Tap your phone on the Wrist Band</p>
        ) : isNfcPermsLoading ? (
          "Checking your device..."
        ) : (
          "Uh oh, your device is not compatible"
        )}

        {isPending
          ? "Reading your tag! Please hold it closely"
          : nfcData
            ? "Wrist band added successfully!"
            : nfcError
              ? "Uh oh, couldn't read your band! Please try again."
              : null}

        <div className="flex w-full justify-center">
          <img className="h-32 w-32 rounded-lg" src="/faces/grin.svg" alt="" />
        </div>
      </motion.div>

      <motion.div
        variants={appComponentVariants}
        className="mb-4 mt-auto flex w-full flex-col gap-4 text-center"
      >
        {nfcData ? (
          <Button
            onClick={() => {
              window.open(
                "https://worldcoin.org/mini-app?app_id=app_staging_a9c5694d434b72499697d674ca67f950",
              );
              window.close();
            }}
            className="h-24 bg-green-600 text-white"
          >
            Success!! You can close this tab!
          </Button>
        ) : nfcError ? (
          <Button
            variant="destructive"
            className="h-24"
            onClick={() => mutate()}
          >
            Unsuccessful! Try again
          </Button>
        ) : (
          <Button onClick={() => mutate()} className="h-24">
            Connect Wrist Band
          </Button>
        )}
      </motion.div>

      {/* <Button
        onClick={() => {
          window.open(
            "https://worldcoin.org/mini-app?app_id=app_staging_a9c5694d434b72499697d674ca67f950",
          );
        }}
        variant="destructive"
      >
        OVERRIDE
      </Button> */}
    </motion.div>
  );
};

export default VerifyNFC;
