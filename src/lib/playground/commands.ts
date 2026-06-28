import {
  type VDir,
  type VNode,
  formatMode,
  getDirAtPath,
  getNodeAtPath,
  listDir,
  makeDir,
  makeFile,
  removeNodeAtPath,
  resolvePath,
  setNodeAtPath,
  cloneTree,
} from "@/lib/playground/vfs";

export type ExecContext = {
  vfs: VDir;
  cwd: string;
};

export type CommandResult = {
  stdout: string;
  stderr: string;
  cwd?: string;
};

type CommandFn = (
  args: string[],
  stdin: string,
  ctx: ExecContext,
) => CommandResult;

function ok(stdout: string): CommandResult {
  return { stdout, stderr: "" };
}

function err(stderr: string): CommandResult {
  return { stdout: "", stderr };
}

function splitFlags(args: string[]): { flags: Set<string>; rest: string[] } {
  const flags = new Set<string>();
  const rest: string[] = [];
  for (const a of args) {
    if (a.startsWith("-") && a.length > 1 && a !== "-") {
      for (const ch of a.slice(1)) flags.add(ch);
    } else {
      rest.push(a);
    }
  }
  return { flags, rest };
}

function readFiles(paths: string[], ctx: ExecContext): string | null {
  const parts: string[] = [];
  for (const p of paths) {
    const node = getNodeAtPath(ctx.vfs, p, ctx.cwd);
    if (!node) return null;
    if (node.type === "dir") return null;
    parts.push(node.content);
  }
  return parts.join("");
}

// prefix is "/" at the root, so a naive `${prefix}/${name}` doubles up to
// "//name" there — only join with a separator when prefix isn't already one.
function joinPath(prefix: string, name: string): string {
  return prefix === "/" ? `/${name}` : `${prefix}/${name}`;
}

function walk(dir: VDir, prefix: string): { path: string; node: VNode }[] {
  const results: { path: string; node: VNode }[] = [];
  for (const name of listDir(dir)) {
    const node = dir.children[name];
    const path = joinPath(prefix, name);
    results.push({ path, node });
    if (node.type === "dir") {
      results.push(...walk(node, path));
    }
  }
  return results;
}

export const COMMANDS: Record<string, CommandFn> = {
  pwd: (_args, _stdin, ctx) => ok(ctx.cwd + "\n"),

  cd: (args, _stdin, ctx) => {
    const target = args[0] ?? "/";
    const dir = getDirAtPath(ctx.vfs, target, ctx.cwd);
    if (!dir) return err(`cd: no such file or directory: ${target}`);
    return { stdout: "", stderr: "", cwd: resolvePath(target, ctx.cwd) };
  },

  ls: (args, _stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const target = rest[0] ?? ".";
    const node = getNodeAtPath(ctx.vfs, target, ctx.cwd);
    if (!node)
      return err(`ls: cannot access '${target}': No such file or directory`);
    if (node.type === "file") return ok(target + "\n");

    const names = listDir(node);
    if (names.length === 0) return ok("");

    if (flags.has("l")) {
      return ok(
        names
          .map((n) => {
            const child = node.children[n];
            const size = child.type === "file" ? child.content.length : 0;
            const mode = formatMode(child.mode, child.type === "dir");
            return `${mode}  1 ${child.owner}  ${child.group}  ${String(size).padStart(5)} ${n}${child.type === "dir" ? "/" : ""}`;
          })
          .join("\n") + "\n",
      );
    }

    return ok(
      names
        .map((n) => (node.children[n].type === "dir" ? n + "/" : n))
        .join("  ") + "\n",
    );
  },

  mkdir: (args, _stdin, ctx) => {
    const { rest } = splitFlags(args);
    if (rest.length === 0) return err("mkdir: missing operand");
    for (const path of rest) {
      const result = setNodeAtPath(ctx.vfs, path, ctx.cwd, makeDir());
      if (!result.ok)
        return err(`mkdir: cannot create directory '${path}': ${result.error}`);
    }
    return ok("");
  },

  touch: (args, _stdin, ctx) => {
    if (args.length === 0) return err("touch: missing file operand");
    for (const path of args) {
      const existing = getNodeAtPath(ctx.vfs, path, ctx.cwd);
      if (existing) continue;
      const result = setNodeAtPath(ctx.vfs, path, ctx.cwd, makeFile());
      if (!result.ok)
        return err(`touch: cannot touch '${path}': ${result.error}`);
    }
    return ok("");
  },

  rm: (args, _stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    if (rest.length === 0) return err("rm: missing operand");
    for (const path of rest) {
      const node = getNodeAtPath(ctx.vfs, path, ctx.cwd);
      if (!node && flags.has("f")) continue;
      if (node?.type === "dir" && !flags.has("r")) {
        return err(`rm: cannot remove '${path}': Is a directory`);
      }
      const result = removeNodeAtPath(ctx.vfs, path, ctx.cwd);
      if (!result.ok && !flags.has("f")) {
        return err(`rm: cannot remove '${path}': ${result.error}`);
      }
    }
    return ok("");
  },

  cp: (args, _stdin, ctx) => {
    const { rest } = splitFlags(args);
    const [src, dest] = rest;
    if (!src || !dest) return err("cp: missing file operand");
    const node = getNodeAtPath(ctx.vfs, src, ctx.cwd);
    if (!node)
      return err(`cp: cannot stat '${src}': No such file or directory`);
    const result = setNodeAtPath(ctx.vfs, dest, ctx.cwd, cloneTree(node));
    if (!result.ok) return err(`cp: ${result.error}`);
    return ok("");
  },

  mv: (args, _stdin, ctx) => {
    const [src, dest] = args;
    if (!src || !dest) return err("mv: missing file operand");
    const node = getNodeAtPath(ctx.vfs, src, ctx.cwd);
    if (!node)
      return err(`mv: cannot stat '${src}': No such file or directory`);
    const setResult = setNodeAtPath(ctx.vfs, dest, ctx.cwd, node);
    if (!setResult.ok) return err(`mv: ${setResult.error}`);
    removeNodeAtPath(ctx.vfs, src, ctx.cwd);
    return ok("");
  },

  cat: (args, stdin, ctx) => {
    if (args.length === 0) return ok(stdin);
    const content = readFiles(args, ctx);
    if (content === null)
      return err(`cat: ${args[0]}: No such file or directory`);
    return ok(content);
  },

  echo: (args) => ok(args.join(" ") + "\n"),

  wc: (args, stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const text = rest.length > 0 ? (readFiles(rest, ctx) ?? "") : stdin;
    const lines =
      text === "" ? 0 : text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const bytes = text.length;

    if (flags.has("l")) return ok(`${lines}\n`);
    if (flags.has("w")) return ok(`${words}\n`);
    if (flags.has("c")) return ok(`${bytes}\n`);
    return ok(`${lines} ${words} ${bytes}\n`);
  },

  head: (args, stdin, ctx) => {
    const { rest } = splitFlags(args);
    const nIdx = args.indexOf("-n");
    const n = nIdx !== -1 ? parseInt(args[nIdx + 1], 10) || 10 : 10;
    const files = rest.filter((a) => a !== String(n));
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const lines = text.split("\n");
    const trailingNewline = text.endsWith("\n");
    const sliced = lines
      .slice(0, trailingNewline ? lines.length - 1 : lines.length)
      .slice(0, n);
    return ok(sliced.join("\n") + (sliced.length > 0 ? "\n" : ""));
  },

  tail: (args, stdin, ctx) => {
    const nIdx = args.indexOf("-n");
    const n = nIdx !== -1 ? parseInt(args[nIdx + 1], 10) || 10 : 10;
    const files = args.filter(
      (a, i) => !a.startsWith("-") && args[i - 1] !== "-n",
    );
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const lines = text.split("\n");
    const trailingNewline = text.endsWith("\n");
    const content = trailingNewline ? lines.slice(0, -1) : lines;
    const sliced = content.slice(-n);
    return ok(sliced.join("\n") + (sliced.length > 0 ? "\n" : ""));
  },

  grep: (args, stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const [pattern, ...files] = rest;
    if (!pattern) return err("grep: missing pattern");

    let re: RegExp;
    try {
      re = new RegExp(pattern, flags.has("i") ? "i" : "");
    } catch {
      return err(`grep: invalid pattern: ${pattern}`);
    }

    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const lines = text
      .split("\n")
      .filter((_, i, arr) => !(i === arr.length - 1 && arr[i] === ""));
    const matched = lines.filter((line) => {
      const isMatch = re.test(line);
      return flags.has("v") ? !isMatch : isMatch;
    });

    if (flags.has("c")) return ok(`${matched.length}\n`);

    const output = matched
      .map((line, i) => (flags.has("n") ? `${i + 1}:${line}` : line))
      .join("\n");
    return ok(output + (matched.length > 0 ? "\n" : ""));
  },

  find: (args, _stdin, ctx) => {
    const startPath = args[0] && !args[0].startsWith("-") ? args[0] : ".";
    const nameIdx = args.indexOf("-name");
    const typeIdx = args.indexOf("-type");
    const namePattern = nameIdx !== -1 ? args[nameIdx + 1] : undefined;
    const typeFilter = typeIdx !== -1 ? args[typeIdx + 1] : undefined;

    const dir = getDirAtPath(ctx.vfs, startPath, ctx.cwd);
    if (!dir) return err(`find: '${startPath}': No such file or directory`);

    const resolvedStart = resolvePath(startPath, ctx.cwd);
    const entries = walk(dir, resolvedStart);
    const all = [{ path: resolvedStart, node: dir as VNode }, ...entries];

    const filtered = all.filter(({ path, node }) => {
      if (typeFilter === "f" && node.type !== "file") return false;
      if (typeFilter === "d" && node.type !== "dir") return false;
      if (namePattern) {
        const regex = new RegExp(
          "^" + namePattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$",
        );
        const basename = path.split("/").pop() ?? "";
        if (!regex.test(basename)) return false;
      }
      return true;
    });

    return ok(
      filtered.map((f) => f.path).join("\n") +
        (filtered.length > 0 ? "\n" : ""),
    );
  },

  sort: (args, stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const text = rest.length > 0 ? (readFiles(rest, ctx) ?? "") : stdin;
    const lines = text
      .split("\n")
      .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));

    lines.sort((a, b) => {
      if (flags.has("n")) return parseFloat(a) - parseFloat(b);
      return a.localeCompare(b);
    });

    if (flags.has("r")) lines.reverse();

    const result = flags.has("u") ? Array.from(new Set(lines)) : lines;
    return ok(result.join("\n") + (result.length > 0 ? "\n" : ""));
  },

  uniq: (args, stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const text = rest.length > 0 ? (readFiles(rest, ctx) ?? "") : stdin;
    const lines = text
      .split("\n")
      .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));

    const counted: { line: string; count: number }[] = [];
    for (const line of lines) {
      const last = counted[counted.length - 1];
      if (last && last.line === line) last.count++;
      else counted.push({ line, count: 1 });
    }

    let result = counted;
    if (flags.has("d")) result = result.filter((c) => c.count > 1);

    const output = result
      .map((c) =>
        flags.has("c") ? `${String(c.count).padStart(4)} ${c.line}` : c.line,
      )
      .join("\n");
    return ok(output + (result.length > 0 ? "\n" : ""));
  },

  cut: (args, stdin, ctx) => {
    const dIdx = args.indexOf("-d");
    const fIdx = args.indexOf("-f");
    const delimiter = dIdx !== -1 ? args[dIdx + 1] : "\t";
    const fields = fIdx !== -1 ? args[fIdx + 1] : undefined;
    const files = args.filter(
      (a, i) =>
        !a.startsWith("-") && args[i - 1] !== "-d" && args[i - 1] !== "-f",
    );
    if (!fields) return err("cut: you must specify a list of fields");

    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const indices = fields.split(",").map((n) => parseInt(n, 10) - 1);
    const lines = text
      .split("\n")
      .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));

    const output = lines
      .map((line) => {
        const parts = line.split(delimiter);
        return indices.map((i) => parts[i] ?? "").join(delimiter);
      })
      .join("\n");
    return ok(output + (lines.length > 0 ? "\n" : ""));
  },

  tr: (args, stdin) => {
    const { flags, rest } = splitFlags(args);
    const [set1, set2] = rest;
    if (!set1) return err("tr: missing operand");

    function expandSet(set: string): string {
      return set.replace(/(.)-(.)/g, (_, a: string, b: string) => {
        let out = "";
        for (let c = a.charCodeAt(0); c <= b.charCodeAt(0); c++)
          out += String.fromCharCode(c);
        return out;
      });
    }

    const from = expandSet(set1);

    if (flags.has("d")) {
      const result = stdin
        .split("")
        .filter((ch) => !from.includes(ch))
        .join("");
      return ok(result);
    }

    if (!set2) return err("tr: missing operand");
    const to = expandSet(set2);
    const result = stdin
      .split("")
      .map((ch) => {
        const idx = from.indexOf(ch);
        return idx !== -1 ? (to[Math.min(idx, to.length - 1)] ?? ch) : ch;
      })
      .join("");
    return ok(result);
  },

  basename: (args) => {
    const [path, suffix] = args;
    if (!path) return err("basename: missing operand");
    let name = path.replace(/\/+$/, "").split("/").pop() ?? path;
    if (suffix && name.endsWith(suffix) && name !== suffix) {
      name = name.slice(0, -suffix.length);
    }
    return ok(name + "\n");
  },

  dirname: (args) => {
    const [path] = args;
    if (!path) return err("dirname: missing operand");
    const trimmed = path.replace(/\/+$/, "");
    const idx = trimmed.lastIndexOf("/");
    if (idx === -1) return ok(".\n");
    if (idx === 0) return ok("/\n");
    return ok(trimmed.slice(0, idx) + "\n");
  },

  realpath: (args, _stdin, ctx) => {
    const [path] = args;
    if (!path) return err("realpath: missing operand");
    return ok(resolvePath(path, ctx.cwd) + "\n");
  },

  // No symlinks exist in this VFS, so a bare `readlink` correctly errors the
  // same way it would on a real, non-symlink file — only -f (canonicalize)
  // has anything meaningful to do here.
  readlink: (args, _stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const [path] = rest;
    if (!path) return err("readlink: missing operand");
    if (!flags.has("f")) return err(`readlink: ${path}: Invalid argument`);
    return ok(resolvePath(path, ctx.cwd) + "\n");
  },

  tree: (args, _stdin, ctx) => {
    const target = args[0] ?? ".";
    const dir = getDirAtPath(ctx.vfs, target, ctx.cwd);
    if (!dir) return err(`tree: ${target}: No such file or directory`);

    let dirCount = 0;
    let fileCount = 0;
    const lines: string[] = [];

    function render(node: VDir, prefix: string) {
      const names = listDir(node);
      names.forEach((name, i) => {
        const child = node.children[name];
        const isLast = i === names.length - 1;
        lines.push(
          prefix +
            (isLast ? "└── " : "├── ") +
            name +
            (child.type === "dir" ? "/" : ""),
        );
        if (child.type === "dir") {
          dirCount++;
          render(child, prefix + (isLast ? "    " : "│   "));
        } else {
          fileCount++;
        }
      });
    }

    render(dir, "");
    lines.push("", `${dirCount} directories, ${fileCount} files`);
    return ok(lines.join("\n") + "\n");
  },

  du: (args, _stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const target = rest[0] ?? ".";
    const dir = getDirAtPath(ctx.vfs, target, ctx.cwd);
    if (!dir)
      return err(`du: cannot access '${target}': No such file or directory`);

    function size(node: VNode): number {
      if (node.type === "file") return node.content.length;
      return Object.values(node.children).reduce((sum, c) => sum + size(c), 0);
    }

    function format(bytes: number): string {
      if (!flags.has("h")) return String(Math.ceil(bytes / 512) || 0);
      if (bytes < 1024) return `${bytes}B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
      return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
    }

    const lines: string[] = [];
    function walkDu(node: VDir, path: string) {
      for (const name of listDir(node)) {
        const child = node.children[name];
        const childPath = joinPath(path, name);
        if (child.type === "dir") {
          walkDu(child, childPath);
          lines.push(`${format(size(child))}\t${childPath}`);
        } else if (flags.has("a")) {
          lines.push(`${format(size(child))}\t${childPath}`);
        }
      }
    }
    const resolvedTarget = resolvePath(target, ctx.cwd);
    walkDu(dir, resolvedTarget);
    lines.push(`${format(size(dir))}\t${resolvedTarget}`);
    return ok(lines.join("\n") + "\n");
  },

  file: (args, _stdin, ctx) => {
    if (args.length === 0) return err("file: missing operand");
    const lines = args.map((path) => {
      const node = getNodeAtPath(ctx.vfs, path, ctx.cwd);
      if (!node) return `${path}: cannot open (No such file or directory)`;
      if (node.type === "dir") return `${path}: directory`;
      if (node.content === "") return `${path}: empty`;
      return `${path}: ASCII text`;
    });
    return ok(lines.join("\n") + "\n");
  },

  split: (args, _stdin, ctx) => {
    const lIdx = args.indexOf("-l");
    const linesPerFile =
      lIdx !== -1 ? parseInt(args[lIdx + 1], 10) || 1000 : 1000;
    const positional = args.filter(
      (a, i) => !a.startsWith("-") && args[i - 1] !== "-l",
    );
    const [input, prefixArg] = positional;
    const prefix = prefixArg ?? "x";
    if (!input) return err("split: missing file operand");
    const content = readFiles([input], ctx);
    if (content === null) return err(`split: cannot open '${input}'`);

    const lines = content.split("\n");
    const body = content.endsWith("\n") ? lines.slice(0, -1) : lines;

    const letters = "abcdefghijklmnopqrstuvwxyz";
    let count = 0;
    for (let i = 0; i < body.length; i += linesPerFile) {
      const chunk = body.slice(i, i + linesPerFile);
      const second = letters[count % 26];
      setNodeAtPath(
        ctx.vfs,
        `${prefix}a${second}`,
        ctx.cwd,
        makeFile(chunk.join("\n") + "\n"),
      );
      count++;
    }
    return ok("");
  },

  chmod: (args, _stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const [modeArg, ...paths] = rest;
    if (!modeArg || paths.length === 0) return err("chmod: missing operand");

    const bits: Record<string, number> = { r: 4, w: 2, x: 1 };
    const positions: Record<string, number> = { u: 0, g: 1, o: 2 };

    function applyMode(node: VNode): boolean {
      if (/^[0-7]{3,4}$/.test(modeArg)) {
        node.mode = modeArg.slice(-3);
        return true;
      }
      const match = /^([ugoa]*)([+\-=])([rwx]+)$/.exec(modeArg);
      if (!match) return false;
      const [, who, op, perms] = match;
      const targets =
        who === "" || who === "a" ? ["u", "g", "o"] : who.split("");
      const permValue = perms
        .split("")
        .reduce((sum, p) => sum + (bits[p] ?? 0), 0);

      const digits = node.mode.padStart(3, "0").split("").map(Number);
      for (const t of targets) {
        const pos = positions[t];
        if (op === "+") digits[pos] |= permValue;
        else if (op === "-") digits[pos] &= ~permValue;
        else digits[pos] = permValue;
      }
      node.mode = digits.join("");
      return true;
    }

    for (const path of paths) {
      const node = getNodeAtPath(ctx.vfs, path, ctx.cwd);
      if (!node)
        return err(`chmod: cannot access '${path}': No such file or directory`);
      const targets: VNode[] =
        flags.has("R") && node.type === "dir"
          ? [node, ...walk(node, path).map((w) => w.node)]
          : [node];
      for (const t of targets) {
        if (!applyMode(t)) return err(`chmod: invalid mode: '${modeArg}'`);
      }
    }
    return ok("");
  },

  chown: (args, _stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const [ownerArg, ...paths] = rest;
    if (!ownerArg || paths.length === 0) return err("chown: missing operand");
    const [owner, group] = ownerArg.split(":");

    for (const path of paths) {
      const node = getNodeAtPath(ctx.vfs, path, ctx.cwd);
      if (!node)
        return err(`chown: cannot access '${path}': No such file or directory`);
      const targets: VNode[] =
        flags.has("R") && node.type === "dir"
          ? [node, ...walk(node, path).map((w) => w.node)]
          : [node];
      for (const t of targets) {
        if (owner) t.owner = owner;
        if (group) t.group = group;
      }
    }
    return ok("");
  },

  stat: (args, _stdin, ctx) => {
    if (args.length === 0) return err("stat: missing operand");
    const blocks = args.map((path) => {
      const node = getNodeAtPath(ctx.vfs, path, ctx.cwd);
      if (!node)
        return `stat: cannot stat '${path}': No such file or directory`;
      const size = node.type === "file" ? node.content.length : 0;
      const mode = formatMode(node.mode, node.type === "dir");
      return [
        `  File: ${path}`,
        `  Size: ${size}\t${node.type === "dir" ? "directory" : "regular file"}`,
        `Access: (${node.mode}/${mode})  Uid: (${node.owner})   Gid: (${node.group})`,
      ].join("\n");
    });
    return ok(blocks.join("\n\n") + "\n");
  },

  // Supports the two most common idioms — s/pattern/replacement/flags and
  // /pattern/d — rather than the full sed language, which needs a proper
  // line-addressing/command parser well beyond this playground's scope.
  sed: (args, stdin, ctx) => {
    const [script, ...files] = args;
    if (!script) return err("sed: missing script");
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;

    const subMatch = /^s(.)(.*)\1(.*)\1([a-z]*)$/.exec(script);
    if (subMatch) {
      const [, , pattern, replacement, flags] = subMatch;
      let re: RegExp;
      try {
        re = new RegExp(pattern, flags.includes("g") ? "g" : "");
      } catch {
        return err(`sed: invalid pattern: ${pattern}`);
      }
      const jsReplacement = replacement.replace(/\\(\d)/g, "$$$1");
      const replaced = text
        .split("\n")
        .map((line) => line.replace(re, jsReplacement))
        .join("\n");
      return ok(replaced);
    }

    const delMatch = /^\/(.*)\/d$/.exec(script);
    if (delMatch) {
      const [, pattern] = delMatch;
      let re: RegExp;
      try {
        re = new RegExp(pattern);
      } catch {
        return err(`sed: invalid pattern: ${pattern}`);
      }
      const lines = text
        .split("\n")
        .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));
      const filtered = lines.filter((line) => !re.test(line));
      return ok(filtered.join("\n") + (filtered.length > 0 ? "\n" : ""));
    }

    return err(`sed: unsupported script: ${script}`);
  },

  // A simplified line-by-line diff (not a true LCS algorithm) — close enough
  // to classic diff output for short, illustrative playground files.
  diff: (args, _stdin, ctx) => {
    const [fileA, fileB] = args;
    if (!fileA || !fileB) return err("diff: missing operand");
    const a = readFiles([fileA], ctx);
    const b = readFiles([fileB], ctx);
    if (a === null) return err(`diff: ${fileA}: No such file or directory`);
    if (b === null) return err(`diff: ${fileB}: No such file or directory`);

    const linesA = a.split("\n");
    const linesB = b.split("\n");
    const max = Math.max(linesA.length, linesB.length);
    const out: string[] = [];
    for (let i = 0; i < max; i++) {
      if (linesA[i] === linesB[i]) continue;
      if (linesA[i] !== undefined && linesB[i] !== undefined) {
        out.push(
          `${i + 1}c${i + 1}`,
          `< ${linesA[i]}`,
          "---",
          `> ${linesB[i]}`,
        );
      } else if (linesA[i] !== undefined) {
        out.push(`${i + 1}d${i}`, `< ${linesA[i]}`);
      } else {
        out.push(`${i}a${i + 1}`, `> ${linesB[i]}`);
      }
    }
    return ok(out.length > 0 ? out.join("\n") + "\n" : "");
  },

  // Assumes both files are already sorted, same as real comm.
  comm: (args, _stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const [fileA, fileB] = rest;
    if (!fileA || !fileB) return err("comm: missing operand");
    const a = readFiles([fileA], ctx);
    const b = readFiles([fileB], ctx);
    if (a === null) return err(`comm: ${fileA}: No such file or directory`);
    if (b === null) return err(`comm: ${fileB}: No such file or directory`);

    const linesA = a.split("\n").filter((l) => l !== "");
    const linesB = b.split("\n").filter((l) => l !== "");
    let i = 0;
    let j = 0;
    const out: string[] = [];
    while (i < linesA.length || j < linesB.length) {
      const x = linesA[i];
      const y = linesB[j];
      if (x !== undefined && (y === undefined || x < y)) {
        if (!flags.has("1")) out.push(x);
        i++;
      } else if (y !== undefined && (x === undefined || y < x)) {
        if (!flags.has("2")) out.push(`\t${y}`);
        j++;
      } else {
        if (!flags.has("3")) out.push(`\t\t${x}`);
        i++;
        j++;
      }
    }
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  // Assumes both files are sorted by the join field (the first
  // space-delimited column), same as real join.
  join: (args, _stdin, ctx) => {
    const [fileA, fileB] = args;
    if (!fileA || !fileB) return err("join: missing operand");
    const a = readFiles([fileA], ctx);
    const b = readFiles([fileB], ctx);
    if (a === null) return err(`join: ${fileA}: No such file or directory`);
    if (b === null) return err(`join: ${fileB}: No such file or directory`);

    const mapB = new Map<string, string[]>();
    for (const line of b.split("\n").filter((l) => l !== "")) {
      const [key, ...rest] = line.split(" ");
      mapB.set(key, rest);
    }

    const out: string[] = [];
    for (const line of a.split("\n").filter((l) => l !== "")) {
      const [key, ...restA] = line.split(" ");
      const restB = mapB.get(key);
      if (restB) out.push([key, ...restA, ...restB].join(" "));
    }
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  paste: (args, _stdin, ctx) => {
    const dIdx = args.indexOf("-d");
    const delimiter = dIdx !== -1 ? args[dIdx + 1] : "\t";
    const files = args.filter(
      (a, i) => !a.startsWith("-") && args[i - 1] !== "-d",
    );
    if (files.length === 0) return err("paste: missing operand");
    const contents = files.map((f) => readFiles([f], ctx));
    if (contents.some((c) => c === null))
      return err("paste: No such file or directory");
    const lineSets = (contents as string[]).map((c) =>
      c.split("\n").filter((l, i, arr) => !(i === arr.length - 1 && l === "")),
    );
    const max = Math.max(...lineSets.map((l) => l.length));
    const out: string[] = [];
    for (let i = 0; i < max; i++) {
      out.push(lineSets.map((l) => l[i] ?? "").join(delimiter));
    }
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  expand: (args, stdin, ctx) => {
    const tIdx = args.indexOf("-t");
    const tabSize = tIdx !== -1 ? parseInt(args[tIdx + 1], 10) || 8 : 8;
    const files = args.filter(
      (a, i) => !a.startsWith("-") && args[i - 1] !== "-t",
    );
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;

    const expanded = text
      .split("\n")
      .map((line) => {
        let out = "";
        for (const ch of line) {
          if (ch === "\t") {
            out += " ".repeat(tabSize - (out.length % tabSize));
          } else {
            out += ch;
          }
        }
        return out;
      })
      .join("\n");
    return ok(expanded);
  },

  fmt: (args, stdin, ctx) => {
    const wIdx = args.indexOf("-w");
    const width = wIdx !== -1 ? parseInt(args[wIdx + 1], 10) || 75 : 75;
    const files = args.filter(
      (a, i) => !a.startsWith("-") && args[i - 1] !== "-w",
    );
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;

    const words = text.split(/\s+/).filter(Boolean);
    const out: string[] = [];
    let line = "";
    for (const word of words) {
      if (line.length === 0) line = word;
      else if (line.length + 1 + word.length <= width) line += " " + word;
      else {
        out.push(line);
        line = word;
      }
    }
    if (line) out.push(line);
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  fold: (args, stdin, ctx) => {
    const wIdx = args.indexOf("-w");
    const width = wIdx !== -1 ? parseInt(args[wIdx + 1], 10) || 80 : 80;
    const files = args.filter(
      (a, i) => !a.startsWith("-") && args[i - 1] !== "-w",
    );
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;

    const out: string[] = [];
    for (const line of text.split("\n")) {
      if (line.length === 0) {
        out.push("");
        continue;
      }
      for (let i = 0; i < line.length; i += width) {
        out.push(line.slice(i, i + width));
      }
    }
    return ok(out.join("\n"));
  },

  nl: (args, stdin, ctx) => {
    const files = args.filter((a) => !a.startsWith("-"));
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const lines = text
      .split("\n")
      .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));
    let n = 0;
    const out = lines.map((line) => {
      if (line.trim() === "") return "";
      n++;
      return `${String(n).padStart(6)}\t${line}`;
    });
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  rev: (args, stdin, ctx) => {
    const text = args.length > 0 ? (readFiles(args, ctx) ?? "") : stdin;
    const lines = text
      .split("\n")
      .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));
    const out = lines.map((l) => [...l].reverse().join(""));
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  tac: (args, stdin, ctx) => {
    const text = args.length > 0 ? (readFiles(args, ctx) ?? "") : stdin;
    const lines = text
      .split("\n")
      .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));
    return ok(lines.reverse().join("\n") + (lines.length > 0 ? "\n" : ""));
  },

  column: (args, stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    const text = rest.length > 0 ? (readFiles(rest, ctx) ?? "") : stdin;
    if (!flags.has("t")) return ok(text);

    const lines = text
      .split("\n")
      .filter((l, i, arr) => !(i === arr.length - 1 && l === ""));
    const rows = lines.map((l) => l.trim().split(/\s+/));
    const colCount = Math.max(0, ...rows.map((r) => r.length));
    const widths = Array.from({ length: colCount }, (_, c) =>
      Math.max(0, ...rows.map((r) => (r[c] ?? "").length)),
    );
    const out = rows
      .map((r) =>
        r
          .map((cell, c) => (cell ?? "").padEnd(widths[c]))
          .join("  ")
          .trimEnd(),
      )
      .join("\n");
    return ok(out + (out.length > 0 ? "\n" : ""));
  },

  tee: (args, stdin, ctx) => {
    const { flags, rest } = splitFlags(args);
    for (const path of rest) {
      const existing = getNodeAtPath(ctx.vfs, path, ctx.cwd);
      const prior =
        existing?.type === "file" && flags.has("a") ? existing.content : "";
      setNodeAtPath(ctx.vfs, path, ctx.cwd, makeFile(prior + stdin));
    }
    return ok(stdin);
  },

  od: (args, stdin, ctx) => {
    const files = args.filter((a) => !a.startsWith("-"));
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const bytes = Array.from(text).map((c) => c.charCodeAt(0));
    const out: string[] = [];
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const octal = chunk.map((b) => b.toString(8).padStart(3, "0")).join(" ");
      out.push(`${i.toString(8).padStart(7, "0")} ${octal}`);
    }
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  xxd: (args, stdin, ctx) => {
    const files = args.filter((a) => !a.startsWith("-"));
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const bytes = Array.from(text).map((c) => c.charCodeAt(0));
    const out: string[] = [];
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const hex = chunk.map((b) => b.toString(16).padStart(2, "0")).join(" ");
      const ascii = chunk
        .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
        .join("");
      out.push(
        `${i.toString(16).padStart(8, "0")}: ${hex.padEnd(47)}  ${ascii}`,
      );
    }
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  strings: (args, stdin, ctx) => {
    const files = args.filter((a) => !a.startsWith("-"));
    const text = files.length > 0 ? (readFiles(files, ctx) ?? "") : stdin;
    const matches = text.match(/[\x20-\x7e]{4,}/g) ?? [];
    return ok(matches.join("\n") + (matches.length > 0 ? "\n" : ""));
  },

  seq: (args) => {
    const nums = args.map((a) => parseFloat(a));
    let start = 1;
    let step = 1;
    let end: number | undefined;
    if (nums.length === 1) [end] = nums;
    else if (nums.length === 2) [start, end] = nums;
    else if (nums.length >= 3) [start, step, end] = nums;
    if (end === undefined || Number.isNaN(end))
      return err("seq: invalid argument");

    const out: string[] = [];
    if (step > 0) for (let i = start; i <= end; i += step) out.push(String(i));
    else if (step < 0)
      for (let i = start; i >= end; i += step) out.push(String(i));
    return ok(out.join("\n") + (out.length > 0 ? "\n" : ""));
  },

  expr: (args) => {
    if (args.length === 3) {
      const [a, op, b] = args;
      const x = parseFloat(a);
      const y = parseFloat(b);
      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        switch (op) {
          case "+":
            return ok(String(x + y) + "\n");
          case "-":
            return ok(String(x - y) + "\n");
          case "*":
            return ok(String(x * y) + "\n");
          case "/":
            return y !== 0
              ? ok(String(Math.trunc(x / y)) + "\n")
              : err("expr: division by zero");
          case "%":
            return y !== 0
              ? ok(String(x % y) + "\n")
              : err("expr: division by zero");
        }
      }
    }
    return err("expr: unsupported expression");
  },

  printf: (args) => {
    const [format, ...rest] = args;
    if (!format) return err("printf: missing format");
    let i = 0;
    const out = format.replace(/%s|%d|\\n|\\t/g, (token) => {
      if (token === "\\n") return "\n";
      if (token === "\\t") return "\t";
      const value = rest[i++] ?? "";
      return token === "%d" ? String(parseInt(value, 10) || 0) : value;
    });
    return ok(out);
  },

  which: (args) => {
    if (args.length === 0) return err("which: missing operand");
    const out = args.map((cmd) =>
      cmd in COMMANDS
        ? `/usr/bin/${cmd}`
        : `which: no ${cmd} in (/usr/bin:/bin)`,
    );
    return ok(out.join("\n") + "\n");
  },

  type: (args) => {
    if (args.length === 0) return err("type: missing operand");
    const out = args.map((cmd) =>
      cmd in COMMANDS
        ? `${cmd} is /usr/bin/${cmd}`
        : `bash: type: ${cmd}: not found`,
    );
    return ok(out.join("\n") + "\n");
  },

  xargs: (args, stdin, ctx) => {
    const [cmdName, ...fixedArgs] = args;
    if (!cmdName) return err("xargs: missing command");
    const fn = COMMANDS[cmdName];
    if (!fn) return err(`xargs: ${cmdName}: command not found`);
    const tokens = stdin.split(/\s+/).filter(Boolean);
    return fn([...fixedArgs, ...tokens], "", ctx);
  },

  help: () =>
    ok(
      [
        "Available commands:",
        "ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, echo, grep, find, wc,",
        "head, tail, sort, uniq, cut, tr, sed, diff, comm, join, paste,",
        "expand, fmt, fold, nl, rev, tac, column, tee, od, xxd, strings,",
        "basename, dirname, realpath, readlink, tree, du, file, split,",
        "chmod, chown, stat, seq, expr, printf, which, type, xargs",
        "",
        "Pipes (|) and redirection (>, >>) are supported.",
        "Type 'reset' to clear the filesystem and start over.",
      ].join("\n") + "\n",
    ),
};
