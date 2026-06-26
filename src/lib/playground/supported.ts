import { COMMANDS } from "@/lib/playground/commands";

export function isPlaygroundSupported(input: string): boolean {
  const stages = input.split("|");
  return stages.every((stage) => {
    const cmd = stage.trim().split(/\s+/)[0];
    return Boolean(cmd && cmd in COMMANDS);
  });
}
