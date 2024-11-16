/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  chain: string;
  owner: `0x${string}`;
};

export async function POST(req: NextRequest) {
  const params = (await req.json()) as Params;

  const db2 = new PrismaClient();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const acc = await db2.accounts.findFirst({
    where: {
      owner: params.owner,
    },
  });

  return NextResponse.json({ status: "ok", account: acc });
}
