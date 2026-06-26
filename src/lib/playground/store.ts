import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeDir, type VDir } from "@/lib/playground/vfs";
import { buildStarterFs } from "@/lib/playground/starter-fs";
import { executeLine } from "@/lib/playground/executor";

type PlaygroundState = {
  initialized: boolean;
  usingStarterFs: boolean;
  vfs: VDir;
  cwd: string;
  history: string[];
  initialize: (starter: boolean) => void;
  runCommand: (input: string) => string;
  reset: () => void;
};

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      initialized: false,
      usingStarterFs: false,
      vfs: makeDir(),
      cwd: "/",
      history: [],

      initialize: (starter) =>
        set({
          initialized: true,
          usingStarterFs: starter,
          vfs: starter ? buildStarterFs() : makeDir(),
          cwd: "/",
          history: [],
        }),

      runCommand: (input) => {
        const trimmed = input.trim();
        if (trimmed === "") return "";

        if (trimmed === "clear") {
          set({ history: [...get().history, input] });
          return "\x1b[2J\x1b[H";
        }

        if (trimmed === "reset") {
          set({ initialized: false, history: [] });
          return "";
        }

        const { vfs, cwd, history } = get();
        const result = executeLine(trimmed, { vfs, cwd });
        set({ vfs, cwd: result.cwd, history: [...history, input] });
        return result.output;
      },

      reset: () => set({ initialized: false, history: [] }),
    }),
    { name: "learnshell-playground" },
  ),
);
