import "@coinbase/onchainkit/styles.css";
import { type Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "~/styles/globals.css";

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
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
