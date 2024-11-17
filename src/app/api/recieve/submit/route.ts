/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { createWalletClient, getContract, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchainSepolia } from "viem/chains";
import { SmartAccountABI } from "~/abis/SmartAccount";
import { networks } from "src/lib/networks";
import { ERC20ABI } from "~/abis/ERC20";

type Params = {
  chain: string;
  receiver: `0x${string}`;
  token: `0x${string}`;
  usdAmount: string;
  signer: `0x${string}`;

  sender: `0x${string}`;
  amount: string;
  signature: `0x${string}`;
};

export async function POST(req: NextRequest) {
  const params = (await req.json()) as Params;
  const adminAccount = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY as `0x${string}`);
  const network = networks[params.chain];
  const client = createWalletClient({
    account: adminAccount,
    chain: worldchainSepolia,
    transport: http(network!.rpcUrls[0]),
  }).extend(publicActions);

  const db = new PrismaClient();

  const record = await db.accounts.findFirst({
    where: {
      signer: params.sender,
    },
  });

  const smartAccount = getContract({
    client,
    address: record?.smartAccount as `0x${string}`,
    abi: SmartAccountABI,
  });
  const erc20 = getContract({
    client,
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
    abi: ERC20ABI,
  });

  const tx1 = await smartAccount.write.withdrawWithSig([adminAccount.address, params.token, BigInt(params.amount), params.signature]);

  const tx2 = await erc20.write.transfer([params.receiver, BigInt(params.amount)]);

  const data = {
    sender: smartAccount.address,
    senderChain: params.chain,
    senderTxHash: tx1,
    receiver: params.receiver,
    receiverChain: params.chain,
    receiverTxHash: tx2,
    amount: params.amount,
    amountUSD: params.usdAmount,
    signer: params.signer,
    timestamp: (new Date()).getTime().toString(),
  }
  const txrecord = await db.transaction.create({
    data: data
  })

  return NextResponse.json({ status: "ok", data });
}
