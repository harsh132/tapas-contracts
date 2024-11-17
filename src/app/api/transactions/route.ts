import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";
import { hashTypedData } from "viem";

type Params = {
  smartAccount: `0x${string}`;
}

export async function POST(req: NextRequest) {
  const params = (await req.json()) as Params;
  const db = new PrismaClient();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const record = await db.transaction.findMany({
    where: {
      OR: [
        {
          sender: params.smartAccount
        },
        {
          receiver: params.smartAccount
        }
      ]
    }
  });

  return NextResponse.json({ status: "ok", result: record });
}
