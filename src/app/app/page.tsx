"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useUtapiaStore } from "~/components/utapia-provider";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import { appComponentVariants, pageVariants } from "./motion-pages";
import Marquee from "~/components/marquee";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const ownerAddress = useUtapiaStore((state) => state.ownerAddress);
  const utapiaAddress = useUtapiaStore((state) => state.utapiaAddress);
  const setUtapiaAddress = useUtapiaStore((state) => state.setUtapiaAddress);
  const router = useRouter();
  const [tapInProgress, setTapInProgress] = useLocalStorage("progress", false);

  const { data: acc } = useQuery({
    queryKey: ["user utapia address"],
    queryFn: async () =>
      await fetch("/api/get-scw-by-owner", {
        body: JSON.stringify({
          owner: ownerAddress,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        (res) =>
          res.json() as unknown as {
            id: number;
            chain: string;
            smartAccount: string;
            owner: string;
            signer: string;
          },
      ),
    enabled: Boolean(ownerAddress),
  });

  useEffect(() => {
    if (utapiaAddress) {
      router.push("/app/home");
    }

    if (acc?.smartAccount) {
      setUtapiaAddress(acc.smartAccount);
      router.push("/app/home");
    }

    if (tapInProgress) {
      setTapInProgress(false);
      router.push("/app/home");
    }
  }, [
    tapInProgress,
    router,
    setTapInProgress,
    utapiaAddress,
    acc,
    setUtapiaAddress,
  ]);

  return (
    <motion.div
      key={"landing"}
      variants={pageVariants}
      className="flex h-full w-full flex-col gap-4"
    >
      <motion.div variants={appComponentVariants} className="header">
        <div className="utapia-gradient absolute right-0 top-0 z-[-1] h-48 w-full rounded-b-3xl"></div>
        <h1 className="pt-16 text-center text-4xl font-bold text-background">
          Welcome to Utapia!
        </h1>
        <h2 className="mt-4 text-center text-background">
          Tap to Pay with crypto. (Satoshi is proud)
        </h2>
      </motion.div>

      <div className="mt-32"></div>
      <Marquee direction="reverse" />
      <Marquee direction="forwards" />

      <motion.div
        variants={appComponentVariants}
        className="mb-4 mt-auto flex w-full flex-col gap-4 text-center"
      >
        <h3>How do you use your crypto?</h3>

        <Button
          className="h-24"
          onClick={() =>
            router.push(`${window.origin}/app/world-user/1-verify-world`)
          }
        >
          I want to <b>Pay</b>
        </Button>

        <Button
          className=""
          variant="secondary"
          disabled={true}
          onClick={() =>
            router.push(`${window.origin}/app/world-merchant/1-verify-world`)
          }
        >
          I am a shop owner
        </Button>
      </motion.div>
    </motion.div>
  );
}
