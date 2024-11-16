"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Edit2, QrCode, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const numpadButtons = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "del",
];

export default function MerchantPayment() {
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();

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

  const handleBack = () => {
    router.back();
  };

  const formattedAmount = amount || "0.00";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex h-full w-full flex-1 flex-col gap-8 py-8">
        {!isConfirmed ? (
          <>
            <header className="relative grid grid-cols-[3rem_auto_3rem] items-center">
              <Button variant="ghost" size="icon" onClick={handleBack}>
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
                onClick={handleBack}
                className=""
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-center text-xl font-bold leading-none">
                Payment Details
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
              <QrCode className="h-32 w-32" />
            </div>

            <Button className="mb-4 mt-auto h-16 w-full text-xl">
              <Wifi className="mr-2 h-8 w-8" />
              Tap to Pay
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
