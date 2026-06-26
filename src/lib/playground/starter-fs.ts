import { makeDir, makeFile, type VDir } from "@/lib/playground/vfs";

export function buildStarterFs(): VDir {
  return makeDir({
    "README.md": makeFile(
      "# learnshell playground\n\nA simulated filesystem — try ls, cat, grep, find, and friends.\n",
    ),
    "notes.txt": makeFile(
      "Buy milk\nCall the dentist\nFinish the quarterly report\nBuy milk\n",
    ),
    src: makeDir({
      "index.ts": makeFile(
        "export function main() {\n  console.log('hello from the playground');\n}\n// TODO: handle edge case\n",
      ),
      "utils.ts": makeFile(
        "export function add(a: number, b: number) {\n  return a + b;\n}\n",
      ),
    }),
    logs: makeDir({
      "app.log": makeFile(
        [
          "2024-01-01 10:00:01 INFO server started",
          "2024-01-01 10:00:05 INFO listening on :3000",
          "2024-01-01 10:02:13 ERROR disk full",
          "2024-01-01 10:02:14 INFO retrying write",
          "2024-01-01 10:05:00 ERROR connection timeout",
          "2024-01-01 10:05:30 INFO connection restored",
        ].join("\n") + "\n",
      ),
    }),
    "package.json": makeFile(
      '{\n  "name": "playground-project",\n  "version": "1.0.0"\n}\n',
    ),
  });
}
