"use client";
import { ArrowDown, ArrowUp, Plus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEnsName } from "wagmi";
import { useTapasStore } from "~/components/tapas-provider";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { shortenAddress } from "~/lib/utils";
import { pageVariants } from "../motion-pages";

// Mock transaction data
const transactions = [
  { id: 1, type: "received", amount: 25.0, from: "Alice", date: "2024-11-16" },
  { id: 2, type: "sent", amount: 15.5, to: "Bob", date: "2024-11-15" },
  {
    id: 3,
    type: "received",
    amount: 50.0,
    from: "Charlie",
    date: "2024-11-14",
  },
  { id: 4, type: "sent", amount: 10.0, to: "David", date: "2024-11-13" },
];

const HomePage = () => {
  const worldAddress = useTapasStore((s) => s.worldAddress);
  const tapasAddress = useTapasStore((s) => s.tapasAddress);
  const { data: ensName } = useEnsName({
    address: worldAddress as `0x`,
  });

  const router = useRouter();

  return (
    <motion.div
      variants={pageVariants}
      key={"home"}
      className="relative flex h-full w-full flex-col gap-4"
    >
      <Card className="tapas-gradient relative mb-6 mt-4 rounded-3xl p-[2px]">
        <div className="absolute left-[-2px] top-[-2px] z-[0] m-1 h-[calc(100%_-_4px)] w-[calc(100%_-_4px)] rounded-[calc(1.5rem_-_4px)] bg-background/95"></div>

        <CardContent className="relative z-[2] p-6">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="tapas-gradient-text mb-4 text-4xl font-bold">
                $43.37
              </p>
              <p className="text-sm">{ensName}</p>
            </div>

            <div className="ml-auto"></div>

            <Button
              className=""
              variant="secondary"
              onClick={() => router.push("/add-funds")}
            >
              Add <Plus className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-foreground/10"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="">{shortenAddress(tapasAddress)}</div>
          <div className="">{shortenAddress(worldAddress)}</div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Balances</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8">
                <Image
                  src="/logo.512.png"
                  alt="Matic"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">USDC</p>
                <p className="text-sm text-muted-foreground">49.019 MATIC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$1</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="tapas-gradient h-8 w-8 rounded-full" />
              <div>
                <p className="font-medium">USDT</p>
                <p className="text-sm text-muted-foreground">1000 USDT</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Activity</h2>

        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-2 ${transaction.type === "received" ? "bg-green-100" : "bg-red-100"}`}
              >
                {transaction.type === "received" ? (
                  <ArrowDown className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowUp className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {transaction.type === "received"
                    ? `Received from ${transaction.from}`
                    : `Sent to ${transaction.to}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date}
                </p>
              </div>
            </div>
            <p
              className={`font-bold ${transaction.type === "received" ? "text-green-600" : "text-red-600"}`}
            >
              {transaction.type === "received" ? "+" : "-"}$
              {transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 left-0 right-0 mt-auto grid grid-cols-2 gap-2">
        <Button
          className="tapas-gradient h-16 text-lg hover:!bg-orange-500"
          onClick={() => router.push("/app/pay")}
        >
          Pay <ArrowUp className="h-5 w-5" />
        </Button>

        <Button
          className="h-16 bg-green-200 text-lg text-foreground hover:bg-green-400"
          onClick={() => router.push("/app/request")}
        >
          Request <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default HomePage;
