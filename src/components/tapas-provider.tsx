import { create } from "zustand";
import React from "react";
import { combine } from "zustand/middleware";

export const useTapasStore = create(
  combine(
    {
      tapasAddress: undefined as undefined | string,
      worldAddress: undefined as undefined | string,
      mode: undefined as "world" | "external" | undefined,
    },
    (set) => ({
      setScwAddress: (tapasAddress: string) => {
        set({ tapasAddress });
      },
      setWorldAddress: (worldAddress: string) => {
        set({ worldAddress });
      },
      setMode: (mode: "world" | "external" | undefined) => {
        set({ mode });
      },
    }),
  ),
);

const TapasProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default TapasProvider;
