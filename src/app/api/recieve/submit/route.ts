/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, publicActions, getContract, hashTypedData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { worldchainSepolia } from 'viem/chains'
import { AccountFactoryABI } from 'src/abis/AccountFactory'
import { SmartAccountABI } from "~/abis/SmartAccount";
import { PrismaClient } from "@prisma/client";

type Params = {
  chain: string;
  receiver: `0x${string}`;
  token: `0x${string}`;
  usdAmount: string;
  sender: `0x${string}`;
  signature: `0x${string}`;
}

export async function POST(req: NextRequest) {
  const params = (await req.json()) as Params;
  const adminAccount = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY as `0x${string}`);
  const client = createWalletClient({
    account: adminAccount,
    chain: worldchainSepolia,
    transport: http("https://4801.rpc.thirdweb.com"),
  }).extend(publicActions);

  const db = new PrismaClient();

  const record = await db.accounts.findFirst({
    where: {
      signer: params.sender
    }
  });

  const smartAccount = getContract({
    client,
    address: record?.smartAccount as `0x${string}`,
    abi: SmartAccountABI,
  });

  const tx = await smartAccount.write.withdrawWithSig([params.receiver, params.token, BigInt(params.usdAmount), params.signature]);

  return NextResponse.json({ status: "ok", tx });
}
