'use server'

import { createPublicClient, http, } from "viem";
import { privateKeyToAccount } from "viem/accounts"
import { entryPoint07Address } from "viem/account-abstraction"
import { toEcdsaKernelSmartAccount } from "permissionless/accounts"

function rpc(chainId: string) {
  return `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${process.env.PIMLICO_API_KEY}`;
}

function rpcClient(chainId: string) {
  return createPublicClient({
    transport: http(rpc(chainId)),
  });
}

export async function deploySmartAccount(chainId: string, owner: `0x${string}`) {
  const client = rpcClient(chainId);


  const kernelAccount = await toEcdsaKernelSmartAccount({
    client: client,
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
    owners: [{ address: owner }],
    index: 0n, // optional
    address: "0x...", // optional, only if you are using an already created account
  })
}