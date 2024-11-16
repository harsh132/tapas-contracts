import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, publicActions, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchainSepolia } from "viem/chains";
import { AccountFactoryABI } from "src/abis/AccountFactory";
import { SmartAccountABI } from "~/abis/SmartAccount";
import { PrismaClient } from "@prisma/client";

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
  const client = createWalletClient({
    account: adminAccount,
    chain: worldchainSepolia,
    transport: http("https://4801.rpc.thirdweb.com"),
  }).extend(publicActions);

  const accountFactory = getContract({
    client,
    address: "0x292a2F570D55b13b56441a401327916b1a0f86F1",
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const acc = await db2.accounts.create({
    data: {
      chain: params.chain,
      smartAccount: account,
      owner: params.owner,
      signer: params.signers[0]!,
    },
  });

  return NextResponse.json({ status: "ok", account });
}
