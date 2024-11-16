import * as Net from "./networks"

import { createSmartAccountClient } from "permissionless"
import { createPublicClient, getContract, http, parseEther, type PublicClient } from "viem"
import { sepolia } from "viem/chains"
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { entryPoint07Address } from "viem/account-abstraction"
import { toEcdsaKernelSmartAccount } from "permissionless/accounts"

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
})

export const paymasterClient = createPimlicoClient({
  transport: http("https://api.pimlico.io/v2/sepolia/rpc?apikey=API_KEY"),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
})

const kernelAccount = await toEcdsaKernelSmartAccount({
  client: publicClient,
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
  owners: [owner],
  index: 0n, // optional
  address: "0x...", // optional, only if you are using an already created account
})

const smartAccountClient = createSmartAccountClient({
  account: kernelAccount,
  chain: sepolia,
  paymaster: paymasterClient,
  bundlerTransport: http("https://api.pimlico.io/v2/sepolia/rpc?apikey=API_KEY"),
  userOperation: {
    estimateFeesPerGas: async () => (await paymasterClient.getUserOperationGasPrice()).fast,
  },
})

export class SmartAccount {
  public network: Net.Network;
  public rpcClient: PublicClient;

  constructor(chainId: string) {
    this.network = Net.networks[chainId]!;
    this.rpcClient = createPublicClient({
      transport: http(this.network.rpcUrl),
    });
  }

  public async account(owner: `0x${string}`) {
    const kernelAccount = await toEcdsaKernelSmartAccount({
      client: publicClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
      owners: [{ address: owner }],
      index: 0n, // optional
      address: "0x...", // optional, only if you are using an already created account
    })
  }

}