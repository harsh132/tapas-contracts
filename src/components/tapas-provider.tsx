import { create } from "zustand";
import React from "react";
import { combine, persist } from "zustand/middleware";

export const useTapasStore = create(
  persist(
    combine(
      {
        tapasAddress: undefined as undefined | string,
        worldAddress: undefined as undefined | string,
        mode: undefined as "world" | "external" | undefined,
      },
      (set) => ({
        setTapasAddress: (tapasAddress: string) => {
          set({ tapasAddress });
        },
        setWorldAddress: (worldAddress: string) => {
          set({ worldAddress });
        },
        setMode: (mode: "world" | "external" | undefined) => {
          set({ mode });
        },
        reset: () => {
          set({
            worldAddress: undefined,
            tapasAddress: undefined,
            mode: undefined,
          });
        },
      }),
    ),
    {
      name: "tapas-storage",
    },
  ),
);

const TapasProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default TapasProvider;
