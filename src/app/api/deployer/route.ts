/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck: sa
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AccountFactoryABI } from "src/abis/AccountFactory";
import { createWalletClient, getContract, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchainSepolia } from "viem/chains";
import { networks } from "src/lib/networks";

type Params = {
  chain: string;
  owner: `0x${string}`;
  signers: `0x${string}`[];
};

export async function POST(req: NextRequest) {
  const params = (await req.json()) as Params;
  const adminAccount = privateKeyToAccount(
    process.env.ADMIN_PRIVATE_KEY as `0x${string}`,
  );
  const network = networks[params.chain];
  const rpc = network!.rpcUrls[0]!;
  const client = createWalletClient({
    account: adminAccount,
    chain: worldchainSepolia,
    transport: http(rpc),
  }).extend(publicActions);

  const accountFactory = getContract({
    client,
    address: process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS as `0x${string}`,
    abi: AccountFactoryABI,
  });

  const account = await accountFactory.read.getAddress([params.owner, 0n]);

  const code = await client.getCode({ address: account });

  console.log(code?.toString().length);
  let tx: `0x${string}`;

  if (code?.toString() == "") {
    tx = await accountFactory.write.createAccountWithSigners([
      params.owner,
      0n,
      params.signers,
    ]);
  }

  const db2 = new PrismaClient();

  const data = params.signers.map((signer) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return {
      chain: params.chain,
      smartAccount: account,
      owner: params.owner,
      signer: signer,
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const acc = await db2.accounts.create({
    data: data,
  });

  return NextResponse.json({ status: "ok", account });
}
