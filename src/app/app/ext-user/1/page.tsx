"use client";
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import { useUtapiaStore } from "~/components/utapia-provider";
import { appComponentVariants, pageVariants } from "../../motion-pages";

const VerifyWorld = () => {
  const ownerAddress = useUtapiaStore((s) => s.ownerAddress);
  const setOwnerAddress = useUtapiaStore((s) => s.setOwnerAddress);

  const router = useRouter();

  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      setOwnerAddress(address);
    }
  }, [address, setOwnerAddress]);

  return (
    <motion.div
      variants={pageVariants}
      key={"verify-world"}
      className="flex h-full w-full flex-col gap-4"
    >
      <motion.div variants={appComponentVariants} className="header">
        <h1 className="utapia-gradient-text pt-16 text-center text-4xl font-bold">
          Connect your wallet
        </h1>

        <p className="mb-12 mt-8 text-center">
          Utapia is hungry for your wallet
        </p>

        <div className="flex w-full justify-center">
          <img
            className="face-wobble h-32 w-32 rounded-lg"
            src="/faces/wink.svg"
            style={
              {
                "--speed": Math.random() * 10 + 10,
                animationDelay: `-${Math.random() * 5}s`,
              } as CSSProperties
            }
            alt=""
          />
        </div>

        {!!ownerAddress && (
          <div className="mt-16 flex w-full justify-center gap-4 text-xl text-green-500">
            Connected! <Check />
          </div>
        )}
      </motion.div>

      <motion.div
        variants={appComponentVariants}
        className="mb-4 mt-auto flex w-full flex-col gap-4 text-center"
      >
        <div className="flex justify-center">
          <Wallet className="w-full">
            <ConnectWallet withWalletAggregator className="w-full">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pb-2 pt-3" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        {address ? (
          <Button
            onClick={() => {
              router.push("/app/ext-user/2");
            }}
            className="utapia-gradient h-24"
          >
            Next (1/2)
          </Button>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default VerifyWorld;
