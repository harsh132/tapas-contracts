// import * as haloWeb from "@arx-research/libhalo/api/web";
import { haloCheckWebNFCPermission, execHaloCmdWeb } from "@arx-research/libhalo/api/web";

export type CommandResponse = {
  "input": {
    "keyNo": number,
    "digest": string
  },
  "signature": {
    "raw": { "r": string, "s": string, "v": 27 | 28 },
    "der": string,
    "ether": `0x${string}`
  },
  "publicKey": string,
  "etherAddress": `0x${string}`
};

export async function checkPermission() {
  return haloCheckWebNFCPermission();
}

export function signMessage(message: string) {
  const command = {
    name: "sign",
    keyNo: 1,
    message,
  };

  return execHaloCmdWeb(command) as Promise<CommandResponse>;
}

/// Sign a digest using the hardware wallet.
/// @param digest The digest to sign in hex without 0x prefix.
export function signDigest(digest: string) {
  if (digest.startsWith("0x")) {
    digest = digest.slice(2);
  }

  const command = {
    name: "sign",
    keyNo: 1,
    digest,
  };

  return execHaloCmdWeb(command) as Promise<CommandResponse>;
}