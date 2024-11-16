import { create } from "zustand";
import React from "react";
import { combine, persist } from "zustand/middleware";

export const useUtapiaStore = create(
  persist(
    combine(
      {
        utapiaAddress: undefined as undefined | string,
        worldAddress: undefined as undefined | string,
        mode: undefined as "world" | "external" | undefined,
      },
      (set) => ({
        setUtapiaAddress: (utapiaAddress: string) => {
          set({ utapiaAddress });
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
            utapiaAddress: undefined,
            mode: undefined,
          });
        },
      }),
    ),
    {
      name: "utapia-storage",
    },
  ),
);

const UtapiaProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default UtapiaProvider;
