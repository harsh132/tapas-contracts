"use client";

import AppProviders from "~/components/providers";
import { ThemeProvider } from "~/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <AppProviders>
        <main className="relative mx-auto flex h-screen w-full max-w-[60ch] flex-col gap-4 px-4">
          {children}
        </main>
      </AppProviders>
    </ThemeProvider>
  );
}
