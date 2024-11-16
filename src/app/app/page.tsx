/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useRouter } from "next/navigation";
import { useTapasStore } from "~/components/tapas-provider";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <div className="header">
        <div className="tapas-gradient absolute right-0 top-0 z-[-1] h-48 w-full rounded-b-3xl"></div>
        <h1 className="pt-16 text-center text-4xl font-bold text-background">
          Welcome to Tapas!
        </h1>
        <h2 className="mt-4 text-center text-background">
          Tap to Pay with crypto. (Satoshi is proud)
        </h2>
      </div>

      <div className="mb-16 mt-auto flex w-full flex-col gap-4 text-center">
        <h3>How do you use your crypto?</h3>

        <Button
          className="h-24"
          onClick={() =>
            router.push(`${window.origin}/app/world-user/1-verify-world`)
          }
        >
          I want to <b>Pay</b>
        </Button>

        <Button
          className=""
          variant="secondary"
          onClick={() =>
            router.push(`${window.origin}/app/world-merchant/1-verify-world`)
          }
        >
          I am a shop owner
        </Button>
      </div>

      {/* <div className="">
        <h3>TESTS</h3>
        <div>Minikit - {String(isMiniKitSuccess)}</div>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          href="/hardware"
        >
          Hardware page
        </Link>

        <Button
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          onClick={() => window.open("https://www.example.com", "_system")}
        >
          Deep link button
        </Button>
      </div> */}
      <Button
        className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        onClick={() => window.open("https://www.example.com", "_system")}
      >
        Deep link button
      </Button>
      <Button
        className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        onClick={() =>
          window.open(
            `https://redirect-tapas-world.vercel.app?redirect=${encodeURIComponent(window.origin + `/app/world-user/2-verify-nfc`)}`,
            "_system",
          )
        }
      >
        Deep link button 2
      </Button>
    </>
  );
}
