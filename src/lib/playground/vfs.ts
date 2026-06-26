export type VFile = {
  type: "file";
  content: string;
};

export type VDir = {
  type: "dir";
  children: Record<string, VNode>;
};

export type VNode = VFile | VDir;

export function makeDir(children: Record<string, VNode> = {}): VDir {
  return { type: "dir", children };
}

export function makeFile(content = ""): VFile {
  return { type: "file", content };
}

function normalizeSegments(path: string, cwd: string): string[] {
  const base = path.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  const parts = path.split("/").filter(Boolean);
  const stack = [...base];

  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }

  return stack;
}

export function resolvePath(path: string, cwd: string): string {
  return "/" + normalizeSegments(path, cwd).join("/");
}

function getNode(root: VDir, segments: string[]): VNode | null {
  let current: VNode = root;
  for (const segment of segments) {
    if (current.type !== "dir") return null;
    const next: VNode | undefined = current.children[segment];
    if (!next) return null;
    current = next;
  }
  return current;
}

export function getNodeAtPath(
  root: VDir,
  path: string,
  cwd: string,
): VNode | null {
  return getNode(root, normalizeSegments(path, cwd));
}

export function getDirAtPath(
  root: VDir,
  path: string,
  cwd: string,
): VDir | null {
  const node = getNodeAtPath(root, path, cwd);
  return node?.type === "dir" ? node : null;
}

export function setNodeAtPath(
  root: VDir,
  path: string,
  cwd: string,
  node: VNode,
): { ok: true } | { ok: false; error: string } {
  const segments = normalizeSegments(path, cwd);
  const name = segments.pop();
  if (!name) return { ok: false, error: "Invalid path" };

  let parent: VNode = root;
  for (const segment of segments) {
    if (parent.type !== "dir") {
      return { ok: false, error: `Not a directory: ${segment}` };
    }
    const next: VNode | undefined = parent.children[segment];
    if (!next) return { ok: false, error: `No such file or directory` };
    parent = next;
  }

  if (parent.type !== "dir") {
    return { ok: false, error: "Not a directory" };
  }

  parent.children[name] = node;
  return { ok: true };
}

export function removeNodeAtPath(
  root: VDir,
  path: string,
  cwd: string,
): { ok: true } | { ok: false; error: string } {
  const segments = normalizeSegments(path, cwd);
  const name = segments.pop();
  if (!name) return { ok: false, error: "Invalid path" };

  const parent = getNode(root, segments);
  if (!parent || parent.type !== "dir") {
    return { ok: false, error: `No such file or directory: ${path}` };
  }
  if (!(name in parent.children)) {
    return { ok: false, error: `No such file or directory: ${path}` };
  }

  delete parent.children[name];
  return { ok: true };
}

export function listDir(dir: VDir): string[] {
  return Object.keys(dir.children).sort();
}

export function cloneTree(node: VNode): VNode {
  if (node.type === "file") return { type: "file", content: node.content };
  const children: Record<string, VNode> = {};
  for (const [name, child] of Object.entries(node.children)) {
    children[name] = cloneTree(child);
  }
  return { type: "dir", children };
}
