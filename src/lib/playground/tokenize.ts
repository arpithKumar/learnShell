export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === " " || ch === "\t") {
      i++;
      continue;
    }
    if (ch === "|") {
      tokens.push("|");
      i++;
      continue;
    }
    if (ch === ">") {
      if (input[i + 1] === ">") {
        tokens.push(">>");
        i += 2;
      } else {
        tokens.push(">");
        i++;
      }
      continue;
    }

    let buf = "";
    let j = i;
    while (j < input.length && !/[\s|>]/.test(input[j])) {
      const c = input[j];
      if (c === '"' || c === "'") {
        const quote = c;
        j++;
        while (j < input.length && input[j] !== quote) {
          buf += input[j];
          j++;
        }
        j++;
      } else {
        buf += c;
        j++;
      }
    }
    tokens.push(buf);
    i = j;
  }

  return tokens;
}

export type ParsedStage = {
  cmd: string;
  args: string[];
  redirect?: { mode: "overwrite" | "append"; file: string };
};

export function parseLine(input: string): ParsedStage[] {
  const tokens = tokenize(input);
  const segments: string[][] = [[]];

  for (const tok of tokens) {
    if (tok === "|") segments.push([]);
    else segments[segments.length - 1].push(tok);
  }

  return segments
    .map((toks): ParsedStage | null => {
      let words = toks;
      let redirect: ParsedStage["redirect"];

      const idx = toks.findIndex((t) => t === ">" || t === ">>");
      if (idx !== -1) {
        const file = toks[idx + 1];
        if (file) {
          redirect = {
            mode: toks[idx] === ">>" ? "append" : "overwrite",
            file,
          };
        }
        words = toks.slice(0, idx);
      }

      const [cmd, ...args] = words;
      if (!cmd) return null;
      return { cmd, args, redirect };
    })
    .filter((s): s is ParsedStage => s !== null);
}
