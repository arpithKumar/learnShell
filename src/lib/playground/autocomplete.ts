import { COMMANDS } from "@/lib/playground/commands";
import { getDirAtPath, listDir, type VDir } from "@/lib/playground/vfs";

export type CompletionResult = {
  matches: string[];
  replaceStart: number;
  replaceEnd: number;
  isDirEntry: boolean[];
};

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (const s of strings.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < s.length && prefix[i] === s[i]) i++;
    prefix = prefix.slice(0, i);
  }
  return prefix;
}

export function getCompletions(
  buffer: string,
  cursor: number,
  vfs: VDir,
  cwd: string,
): CompletionResult {
  let start = cursor;
  while (start > 0 && buffer[start - 1] !== " ") start--;
  let end = cursor;
  while (end < buffer.length && buffer[end] !== " ") end++;

  const word = buffer.slice(start, end);
  const isFirstWord = buffer.slice(0, start).trim().length === 0;

  if (isFirstWord) {
    const matches = Object.keys(COMMANDS)
      .filter((c) => c.startsWith(word))
      .sort();
    return {
      matches,
      replaceStart: start,
      replaceEnd: end,
      isDirEntry: matches.map(() => false),
    };
  }

  const lastSlash = word.lastIndexOf("/");
  const dirPart = lastSlash === -1 ? "." : word.slice(0, lastSlash) || "/";
  const namePart = lastSlash === -1 ? word : word.slice(lastSlash + 1);
  const prefix = lastSlash === -1 ? "" : word.slice(0, lastSlash + 1);

  const dir = getDirAtPath(vfs, dirPart, cwd);
  if (!dir) {
    return {
      matches: [],
      replaceStart: start,
      replaceEnd: end,
      isDirEntry: [],
    };
  }

  const names = listDir(dir).filter((n) => n.startsWith(namePart));
  const matches = names.map((n) => prefix + n);
  const isDirEntry = names.map((n) => dir.children[n].type === "dir");

  return { matches, replaceStart: start, replaceEnd: end, isDirEntry };
}

export function applyCompletion(
  buffer: string,
  result: CompletionResult,
): { buffer: string; cursor: number; listing: string[] } | null {
  const { matches, replaceStart, replaceEnd, isDirEntry } = result;
  if (matches.length === 0) return null;

  if (matches.length === 1) {
    const isDir = isDirEntry[0];
    const insertion = matches[0] + (isDir ? "/" : " ");
    const newBuffer =
      buffer.slice(0, replaceStart) + insertion + buffer.slice(replaceEnd);
    return {
      buffer: newBuffer,
      cursor: replaceStart + insertion.length,
      listing: [],
    };
  }

  const current = buffer.slice(replaceStart, replaceEnd);
  const lcp = longestCommonPrefix(matches);

  if (lcp.length > current.length) {
    const newBuffer =
      buffer.slice(0, replaceStart) + lcp + buffer.slice(replaceEnd);
    return {
      buffer: newBuffer,
      cursor: replaceStart + lcp.length,
      listing: [],
    };
  }

  return { buffer, cursor: replaceEnd, listing: matches };
}
