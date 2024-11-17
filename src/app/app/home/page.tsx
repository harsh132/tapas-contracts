/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useEnsName } from "wagmi";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useUtapiaStore } from "~/components/utapia-provider";
import useTokenBalanceStore from "~/hooks/useTokenBalanceStore";
import { TOKENS } from "~/lib/constants/tokens";
import { pageVariants } from "../motion-pages";
import { formatNumber } from "~/lib/formatNumber";
import Link from "next/link";
import { shortenAddress } from "~/lib/utils";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const chainBalances = useTokenBalanceStore((s) => s.chainBalances);
  const mode = useUtapiaStore((s) => s.mode);
  const ownerAddress = useUtapiaStore((s) => s.ownerAddress);
  const utapiaAddress = useUtapiaStore((s) => s.utapiaAddress);
  const setUtapiaAddress = useUtapiaStore((s) => s.setUtapiaAddress);
  const reset = useUtapiaStore((s) => s.reset);
  const { data: ensName } = useEnsName({
    address: ownerAddress as `0x`,
  });

  const router = useRouter();

  const usdBalance = useMemo(() => {
    let bal = 0;

    Object.entries(chainBalances).forEach(([chain, cb]) => {
      Object.entries(cb).forEach(([token, balance]) => {
        bal += Number(balance) * (TOKENS[Number(chain)]![token]!.price ?? 0);
      });
    });

    return bal;
  }, [chainBalances]);

  const { data: utapiaid } = useQuery({
    queryKey: ["owner utapia id"],
    queryFn: async () => {
      const res = await fetch("/api/get-scw-by-owner", {
        body: JSON.stringify({
          owner: ownerAddress,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await res.json()) as { status: string; account: string };

      return data.account;
    },
  });
  useEffect(() => {
    if (utapiaid) {
      setUtapiaAddress(utapiaid);
    }
  }, [utapiaid, setUtapiaAddress]);

  const { data: transactions } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          owner: ownerAddress,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const records = (await res.json()).result as {
        id: number;
        timestamp: string;
        sender: string;
        signer: string;
        amount: string;
        senderChain: string;
        senderTxHash: string;
        receiver: string;
        receiverChain: string;
        receiverTxHash: string;
        amountUSD: string;
      }[];

      const t2 = records.map((record) => {
        return {
          id: record.id,
          type: record.sender === ownerAddress ? "sent" : "received",
          amount: parseFloat(record.amountUSD),
          from: record.sender,
          to: record.receiver,
          date: new Date(record.timestamp).toLocaleDateString(),
        };
      });

      return t2;
    },
  });

  return (
    <motion.div
      variants={pageVariants}
      key={"home"}
      className="relative flex h-full w-full flex-col gap-4"
    >
      <Card className="utapia-gradient relative mb-6 mt-4 rounded-3xl p-[2px]">
        <div className="absolute left-[-2px] top-[-2px] z-[0] m-1 h-[calc(100%_-_4px)] w-[calc(100%_-_4px)] rounded-[calc(1.5rem_-_4px)] bg-background/95"></div>

        <CardContent className="relative z-[2] flex flex-col gap-2 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="utapia-gradient-text text-4xl font-bold">
                ${formatNumber(usdBalance)}
              </p>
              <p className="text-sm">{ensName}</p>
            </div>

            <div className="ml-auto"></div>

            <Button
              className=""
              onClick={() =>
                mode === "world"
                  ? router.push("/app/add-funds/world")
                  : router.push("/app/add-funds/external")
              }
            >
              Add Funds <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button className="bg-foreground text-sm text-background">
              {mode === "external" ? (
                <img className="h-5 w-5" src="/chains/base.png" alt="" />
              ) : (
                <img className="h-5 w-5" src="/chains/world.png" alt="" />
              )}

              {mode === "external" ? "Base" : "World"}
            </Button>
          </div>

          <div className="flex justify-end">
            <div className="">{ensName}</div>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-foreground/10"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Link
            href={
              mode === "world"
                ? `https://worldchain-mainnet.explorer.alchemy.com/address/${utapiaAddress}`
                : `https://base.blockscout.com/address/${utapiaAddress}`
            }
            className="w-fit text-muted-foreground"
            target="_blank"
          >
            {shortenAddress(utapiaAddress)}
          </Link>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Balances</h2>
        <div className="space-y-4">
          {Object.values(TOKENS[mode === "world" ? 4801 : 84532] ?? {}).map(
            (token) => (
              <div
                className="flex items-center justify-between"
                key={`${token.address} + ${token.chainId}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full">
                    <img
                      src={`/tokens/${token.symbol.toLowerCase()}.png`}
                      className="utapia-gradient h-8 w-8 rounded-full"
                      alt="alt"
                    />
                  </div>

                  <div>
                    <p className="font-medium">{token.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(
                        chainBalances[token.chainId]?.[token.address] ?? "0",
                      )}{" "}
                      {token.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    $
                    {formatNumber(
                      parseFloat(
                        chainBalances[token.chainId]?.[token.address] ?? "0",
                      ) * (token.price ?? 0),
                    )}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Activity</h2>

        {transactions
          ? transactions?.map((transaction) => (
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
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <div
                className="flex items-center justify-between border-b py-3 last:border-b-0"
                key={i}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full bg-accent p-2`}>
                    <ArrowUpDown className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="bg-accent font-medium text-transparent">
                      ..............................
                    </p>
                    <p className="bg-accent text-sm text-transparent">
                      ................... ..........
                    </p>
                  </div>
                </div>
                <p className={`bg-accent font-bold text-transparent`}>
                  ...........................
                </p>
              </div>
            ))}
      </div>

      <div className="sticky bottom-4 left-0 right-0 mt-auto grid grid-cols-2 gap-2">
        <Button
          className="utapia-gradient h-16 text-lg hover:!bg-orange-500"
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

      <Button className="mt-64" variant="destructive" onClick={reset}>
        <Trash2 />
        Reset
      </Button>
    </motion.div>
  );
};

export default HomePage;
