import {
  type VDir,
  type VNode,
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

function walk(dir: VDir, prefix: string): { path: string; node: VNode }[] {
  const results: { path: string; node: VNode }[] = [];
  for (const name of listDir(dir)) {
    const node = dir.children[name];
    const path = `${prefix}/${name}`;
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
            const kind = child.type === "dir" ? "d" : "-";
            const size = child.type === "file" ? child.content.length : 0;
            return `${kind}rw-r--r--  1 you  staff  ${String(size).padStart(5)} ${n}${child.type === "dir" ? "/" : ""}`;
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

  help: () =>
    ok(
      [
        "Available commands:",
        "ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, echo,",
        "grep, find, wc, head, tail, sort, uniq, cut, tr",
        "",
        "Pipes (|) and redirection (>, >>) are supported.",
        "Type 'reset' to clear the filesystem and start over.",
      ].join("\n") + "\n",
    ),
};
