// Assumes the starter filesystem (README.md, notes.txt, logs/, src/) exists.
export const QUICKSTART_COMMANDS_SAMPLE = [
  { label: "List files in detail", cmd: "ls -l" },
  { label: "Read the README", cmd: "cat README.md" },
  { label: "Find TODOs in code", cmd: "grep -rn TODO src" },
  { label: "Filter error logs", cmd: "cat logs/app.log | grep ERROR" },
  { label: "Count duplicate notes", cmd: "sort notes.txt | uniq -c" },
  { label: "Write a new file", cmd: "echo 'hello playground' > scratch.txt" },
] as const;

// Safe to run with nothing on disk yet — builds up from a blank filesystem.
export const QUICKSTART_COMMANDS_EMPTY = [
  { label: "Make a folder", cmd: "mkdir projects" },
  { label: "Create a file", cmd: "touch hello.txt" },
  { label: "Write to it", cmd: "echo 'hello playground' > hello.txt" },
  { label: "Read it back", cmd: "cat hello.txt" },
  { label: "See what you've made", cmd: "ls -l" },
  { label: "Pipe it through a filter", cmd: "cat hello.txt | tr a-z A-Z" },
] as const;

export const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  echo: "Print text, or write it to a file with > / >>.",
  help: "List every command this simulated shell understands.",
};
