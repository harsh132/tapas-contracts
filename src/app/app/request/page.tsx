"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Edit2, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { numpadButtons } from "~/lib/constants";
import * as halo from "src/lib/halo";
import { useUtapiaStore } from "~/components/utapia-provider";
import QRCode from "react-qr-code";

export default function MerchantPayment() {
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();
  const mode = useUtapiaStore((s) => s.mode);
  const utapiaAddress = useUtapiaStore((s) => s.utapiaAddress);

  const handleNumberClick = (num: string) => {
    if (amount.includes(".") && amount.split(".")[1]?.length === 4) return;
    if (amount === "0" && num === "0") return;

    setAmount((prev) => {
      if (num === "." && prev.includes(".")) return prev;
      if (num === "." && prev === "") return "0.";
      return prev + num;
    });
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsConfirmed(true);
    }
  };

  const handleEdit = () => {
    setIsConfirmed(false);
  };

  const { data: nfcPerms, isLoading: isNfcPermsLoading } = useQuery({
    queryKey: ["nfc perms"],
    queryFn: async () => await halo.checkPermission().then(() => true),
  });

  const {
    mutate,
    isPending,
    data: completedTxHash,
  } = useMutation({
    mutationKey: ["tap nfc"],
    mutationFn: async () => {
      const nfcAddress = await halo.getKey();
      if (!nfcAddress) {
        throw new Error("Could not scan the NFC");
      }

      const res = await fetch("/api/recieve", {
        body: JSON.stringify({
          chain: mode === "world" ? "4801" : "84532",
          receiver: nfcAddress,
          // world usdc
          token: "0x79a02482a880bce3f13e09da970dc34db4cd24d1",
          usdAmount: amount,
          sender: utapiaAddress,
        }),
      });

      const { hash } = (await res.json()) as { status: string; hash: string };

      const signature = await halo.signDigest(hash);

      const res2 = await fetch("/api/submit", {
        body: JSON.stringify({
          chain: mode === "world" ? "4801" : "84532",
          receiver: nfcAddress,
          // world usdc
          token: "0x79a02482a880bce3f13e09da970dc34db4cd24d1",
          usdAmount: amount,
          sender: utapiaAddress,
          signature,
        }),
      });

      const data = (await res2.json()) as { status: string; tx: string };

      return data.tx;
    },
  });

  useEffect(() => {
    if (completedTxHash) router.push(`/app/tx/${completedTxHash}`);
  }, [completedTxHash, router]);

  const formattedAmount = amount || "0.00";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex h-full w-full flex-1 flex-col gap-8 py-8">
        {!isConfirmed ? (
          <>
            <header className="relative grid grid-cols-[3rem_auto_3rem] items-center">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-center text-xl font-bold leading-none">
                Request Payment
              </h1>
              <div className=""></div>
            </header>

            <div className="text-center text-6xl font-bold text-orange-500">
              <span className="text-foreground/15">$&nbsp;</span>
              <AnimatePresence mode="popLayout">
                {formattedAmount.split("").map((digit, index) => (
                  <motion.span
                    key={`${digit}-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {digit}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-4">
              {numpadButtons.map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "del" ? "destructive" : "outline"}
                  className="h-16 text-2xl"
                  onClick={() =>
                    btn === "del" ? handleDelete() : handleNumberClick(btn)
                  }
                >
                  {btn === "del" ? "⌫" : btn}
                </Button>
              ))}
            </div>

            <Button
              className="h-16 w-full text-xl"
              onClick={handleConfirm}
              disabled={!amount || parseFloat(amount) === 0}
            >
              Confirm
            </Button>
          </>
        ) : (
          <>
            <header className="relative grid grid-cols-[3rem_auto_3rem] items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className=""
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-center text-xl font-bold leading-none">
                Request Payment
              </h1>

              <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Edit2 className="h-6 w-6" />
              </Button>
            </header>

            <div className="text-center text-6xl font-bold text-orange-500">
              <span className="text-foreground/15">$&nbsp;</span>
              <AnimatePresence mode="popLayout">
                {formattedAmount.split("").map((digit, index) => (
                  <motion.span
                    key={`${digit}-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {digit}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex h-32 w-full items-center justify-center space-x-4">
              <QRCode
                value={`${window?.origin}/app/pay?amount=${amount}&to=${utapiaAddress}`}
                bgColor="#FFFFFF"
                fgColor="#000000"
                size={160}
              />
            </div>

            <Button
              className="mb-4 mt-auto h-16 w-full text-xl"
              onClick={() => mutate()}
            >
              <Wifi className="mr-2 h-10 w-10 rotate-180" />
              {isPending ? "Scanning NFCs" : "Scan NFC to Accept Payment"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
