import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, "+")
    .replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

// async function hardwareSign() {
//   const command = {
//     name: "sign",
//     keyNo: 1,
//     message: "010203",
//     /* uncomment the line below if you get an error about setting "command.legacySignCommand = true" */
//     // legacySignCommand: true,
//   };

//   void halo.execHaloCmdWeb(command).then((response) => {
//     setLogs(JSON.stringify(response, null, 2));
//   });
// }
