import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { hashTypedData } from "viem";

type Params = {
  chain: string;
  receiver: `0x${string}`;
  token: `0x${string}`;
  usdAmount: string;
  sender: `0x${string}`;
};

export async function POST(req: NextRequest) {
  const params = (await req.json()) as Params;

  const db = new PrismaClient();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const record = await db.accounts.findFirst({
    where: {
      signer: params.sender,
    },
  });

  // All properties on a domain are optional
  const domain = {
    name: "SmartAccount",
    version: "v0.0.1",
    chainId: parseInt(params.chain),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    verifyingContract: record?.smartAccount as `0x${string}`,
  } as const;

  // The named list of all type definitions
  const types = {
    withdraw: [
      { name: "to", type: "address" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  } as const;

  const hash = hashTypedData({
    domain: domain,
    types: types,
    primaryType: "withdraw",
    message: {
      to: params.receiver,
      token: params.token,
      amount: BigInt(params.usdAmount),
    },
  });

  return NextResponse.json({ status: "ok", hash });
}
