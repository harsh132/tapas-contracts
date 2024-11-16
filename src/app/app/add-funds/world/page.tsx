"use client";
import {
  MiniKit,
  PayCommandInput,
  Tokens,
  tokenToDecimals,
} from "@worldcoin/minikit-js";

import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import { useUtapiaStore } from "~/components/utapia-provider";
import { numpadButtons } from "~/lib/constants";

const AddWorldFunds = () => {
  const utapiaAddress = useUtapiaStore((s) => s.utapiaAddress);

  const { mutate, data, isPending } = useMutation({
    mutationKey: ["pay crypto world"],
    mutationFn: async () => {
      if (!utapiaAddress) return;

      const res = await fetch("/api/initiate-payment", {
        method: "POST",
      });
      const { id } = await res.json();

      const payload: PayCommandInput = {
        reference: id,
        to: utapiaAddress, // Test address
        tokens: [
          {
            symbol: Tokens.USDCE,
            token_amount: tokenToDecimals(3, Tokens.USDCE).toString(),
          },
        ],
        description: "Test example payment for minikit",
      };

      if (MiniKit.isInstalled()) {
        return false;
      }

      const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

      if (finalPayload.status == "success") {
        const res = await fetch(`/api/confirm-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        });
        const payment = await res.json();
        if (payment.success) {
          // Congrats your payment was successful!
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
  });

  const router = useRouter();

  const [amount, setAmount] = useState("");

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

  const formattedAmount = amount || "0.00";

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="mx-auto flex h-full w-full flex-1 flex-col gap-8 py-8">
        <header className="relative grid grid-cols-[3rem_auto_3rem] items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <h1 className="text-center text-xl font-bold leading-none">
            Add Funds
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
          onClick={() => mutate()}
          disabled={!amount || parseFloat(amount) === 0}
        >
          Add funds
        </Button>
      </div>
    </div>
  );
};

export default AddWorldFunds;
