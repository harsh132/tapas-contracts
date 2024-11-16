"use client";

import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { ThemeProvider } from "~/components/theme-provider";

const Providers = dynamic(
  () => import("~/components/providers").then((c) => c.default),
  { ssr: false },
);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-40 w-40 items-center justify-center">
              <LoaderCircle className="stroke-white-600 h-10 w-10 animate-spin" />
            </div>
          </div>
        }
      >
        <Providers>
          <motion.main className="relative mx-auto flex h-[100svh] w-full max-w-[60ch] flex-col gap-4 px-4">
            <AnimatePresence>{children}</AnimatePresence>
          </motion.main>
        </Providers>
      </Suspense>
    </ThemeProvider>
  );
}
