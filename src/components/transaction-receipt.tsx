import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { formatNumber } from "~/lib/formatNumber";

const TransactionReceipt = ({
  amount,
  recipient,
  timestamp,
}: {
  amount: string;
  recipient: string;
  timestamp: number;
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex w-full flex-col items-center justify-center bg-background py-8"
    >
      <header className="relative grid w-full grid-cols-[3rem_auto_3rem] items-center">
        <div className=""></div>

        <h1 className="text-center text-xl font-bold leading-none">
          Payment Completed!
        </h1>

        <div className=""></div>
      </header>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 5 }}
        className="mb-8 text-primary"
      >
        <CheckCircle className="h-24 w-24" />
      </motion.div>

      <div className="flex w-full flex-col gap-4 pt-8">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="font-bold">${formatNumber(amount)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">To</span>
          <span>{recipient}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span>{new Date(timestamp).toLocaleDateString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction ID</span>
          <span className="font-mono text-sm">0x00000</span>
        </div>
      </div>

      <Button
        className="mt-auto w-full"
        onClick={() => router.push("/app/home")}
      >
        Close
      </Button>
    </motion.div>
  );
};

export default TransactionReceipt;
