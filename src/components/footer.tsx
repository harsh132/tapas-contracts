"use client";
import React from "react";
import { PushNotificationManager } from "./notifications";
import { InstallPrompt } from "./install";
import { ModeToggle } from "./mode-toggle";

const Footer = () => {
  return (
    <footer className="flex w-full justify-between gap-8 rounded-t-3xl border-l-2 border-r-2 border-t-2 border-primary bg-accent p-8 px-4">
      <PushNotificationManager />
      <InstallPrompt />
      <ModeToggle />
    </footer>
  );
};

export default Footer;
