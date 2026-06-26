import { parseLine } from "@/lib/playground/tokenize";
import { COMMANDS, type ExecContext } from "@/lib/playground/commands";
import { getNodeAtPath, makeFile, setNodeAtPath } from "@/lib/playground/vfs";

export type ExecuteResult = {
  output: string;
  cwd: string;
};

export function executeLine(input: string, ctx: ExecContext): ExecuteResult {
  const stages = parseLine(input.trim());
  if (stages.length === 0) return { output: "", cwd: ctx.cwd };

  let stdin = "";
  let cwd = ctx.cwd;

  for (const stage of stages) {
    const fn = COMMANDS[stage.cmd];
    if (!fn) {
      return {
        output: `command not found: ${stage.cmd}`,
        cwd,
      };
    }

    const result = fn(stage.args, stdin, { vfs: ctx.vfs, cwd });
    if (result.cwd) cwd = result.cwd;

    if (result.stderr) {
      return { output: result.stderr, cwd };
    }

    if (stage.redirect) {
      const existing = getNodeAtPath(ctx.vfs, stage.redirect.file, cwd);
      const prior =
        existing?.type === "file" && stage.redirect.mode === "append"
          ? existing.content
          : "";
      setNodeAtPath(
        ctx.vfs,
        stage.redirect.file,
        cwd,
        makeFile(prior + result.stdout),
      );
      stdin = "";
    } else {
      stdin = result.stdout;
    }
  }

  return { output: stdin, cwd };
}
