import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This is a workaround for the issue with BigInt serialization in JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(BigInt.prototype as any).toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return this.toString();
};

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, "+")
    .replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

/**
 * A generic GraphQL fetcher.
 * @param url The URL to fetch from.
 * @param query The GraphQL query to execute.
 * @param variables The variables to pass to the query.
 * @returns The response from the query.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gqlFetcher = async (
  url: string,
  query: string,
  variables: Record<string, any>,
): Promise<any> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return (await response.json()).data;
};

/**
 * The native ETH address.
 */
export const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

/**
 * Capitalizes the first letter of a word.
 * @param word The word to capitalize.
 */
export const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Returns true if the two tokens are equal.
 * @param tokenA The first token.
 * @param tokenB The second token.
 * @returns True if the two tokens are equal.
 */
export const areTokensEqual = (
  tokenA: string | undefined,
  tokenB: string | undefined,
): boolean => {
  // Early return if either token is undefined
  if (!tokenA || !tokenB) return false;

  // Early return if lengths are different
  if (tokenA.length !== tokenB.length) return false;

  // Case-insensitive comparison without creating new strings
  for (let i = 0; i < tokenA.length; i++) {
    const charA = tokenA.charAt(i).toLowerCase();
    const charB = tokenB.charAt(i).toLowerCase();

    if (charA !== charB) return false;
  }

  return true;
};

/**
 * Returns true if the address is the native ETH address.
 * @param address The address to check.
 * @returns True if the address is the native ETH address.
 */
export const isTokenETH = (address: string) =>
  areAddressesEqual(address, NATIVE_ADDRESS);

/**
 * Returns true if the two addresses are equal.
 * @param addressA The first address.
 * @param addressB The second address.
 * @returns True if the two addresses are equal.
 */
export const areAddressesEqual = (
  addressA: string | undefined,
  addressB: string | undefined,
) => {
  if (!addressA || !addressB) return false;

  if (addressA.length !== addressB.length) return false;

  for (let i = 0; i < addressA.length; i++) {
    const charA = addressA.charAt(i).toLowerCase();
    const charB = addressB.charAt(i).toLowerCase();

    if (charA !== charB) return false;
  }

  return true;
};

/**
 * Shortens an address by removing characters from the middle.
 * @param address The address to shorten.
 * @param chars The number of characters to keep on each side.
 * @returns The shortened address.
 */
export const shortenAddress = (address: string | undefined, chars = 4) =>
  address ? `${address?.slice(0, chars + 2)}...${address?.slice(-chars)}` : "";

export const isBase58 = (str: string) => {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(str);
};

export function shortenTxn(txHash: string, chars = 4): string {
  if (!txHash) return "";
  return `${txHash.substring(0, chars + 2)}...${txHash.substring(txHash.length - chars)}`;
}

export function toUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
