import "@coinbase/onchainkit/styles.css";
import { type Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "~/styles/globals.css";
import { headers } from "next/headers";
import { getConfig } from "~/lib/constants/wagmiConfig";
import { cookieToInitialState } from "wagmi";
import Providers from "~/components/providers";

const poppins = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Utapia",
  description:
    "Utapia makes your life easy by letting you pay in crypto anywhere!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie"),
  );

  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
