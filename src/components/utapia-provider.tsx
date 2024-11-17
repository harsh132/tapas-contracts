import { create } from "zustand";
import React from "react";
import { combine, createJSONStorage, persist } from "zustand/middleware";

export const useUtapiaStore = create(
  persist(
    combine(
      {
        utapiaAddress: undefined as undefined | string,
        ownerAddress: undefined as undefined | string,
        mode: undefined as "world" | "external" | undefined,
      },
      (set) => ({
        setUtapiaAddress: (utapiaAddress: string) => {
          set({ utapiaAddress });
        },
        setOwnerAddress: (ownerAddress: string) => {
          set({ ownerAddress });
        },
        setMode: (mode: "world" | "external" | undefined) => {
          set({ mode });
        },
        reset: () => {
          set({
            ownerAddress: undefined,
            utapiaAddress: undefined,
            mode: undefined,
          });
        },
      }),
    ),
    {
      name: "utapia-storage",
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        mode: state.mode,
        utapiaAddress: state.utapiaAddress,
        ownerAddress: state.ownerAddress,
      }),
    },
  ),
);

const UtapiaProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default UtapiaProvider;
