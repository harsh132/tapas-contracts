"use client";
import { InstallPrompt } from "~/components/install";
import { PushNotificationManager } from "~/components/notifications";

export default function HomePage() {
  return (
    <main className="">
      <h1>Tapas</h1>

      <PushNotificationManager />
      <InstallPrompt />
    </main>
  );
}
