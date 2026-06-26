export type ShortcutContext = "readline" | "vi" | "tmux";

export type ShortcutEntry = {
  keys: string;
  description: string;
  context: ShortcutContext;
};

export const SHORTCUTS: ShortcutEntry[] = [
  // Readline / Emacs editing (the bash/zsh default)
  {
    keys: "Ctrl+A",
    description: "Move the cursor to the beginning of the line.",
    context: "readline",
  },
  {
    keys: "Ctrl+E",
    description: "Move the cursor to the end of the line.",
    context: "readline",
  },
  {
    keys: "Ctrl+B",
    description: "Move the cursor back one character.",
    context: "readline",
  },
  {
    keys: "Ctrl+F",
    description: "Move the cursor forward one character.",
    context: "readline",
  },
  {
    keys: "Alt+B",
    description: "Move the cursor back one word.",
    context: "readline",
  },
  {
    keys: "Alt+F",
    description: "Move the cursor forward one word.",
    context: "readline",
  },
  {
    keys: "Ctrl+W",
    description: "Delete the word immediately before the cursor.",
    context: "readline",
  },
  {
    keys: "Ctrl+U",
    description: "Delete everything from the cursor to the start of the line.",
    context: "readline",
  },
  {
    keys: "Ctrl+K",
    description: "Delete everything from the cursor to the end of the line.",
    context: "readline",
  },
  {
    keys: "Ctrl+Y",
    description: "Paste back the last text you deleted (yank).",
    context: "readline",
  },
  {
    keys: "Ctrl+R",
    description: "Search backward through command history as you type.",
    context: "readline",
  },
  {
    keys: "Ctrl+G",
    description: "Cancel an in-progress history search.",
    context: "readline",
  },
  {
    keys: "Ctrl+L",
    description: "Clear the terminal screen (same as the clear command).",
    context: "readline",
  },
  {
    keys: "Ctrl+C",
    description: "Send SIGINT, interrupting the currently running command.",
    context: "readline",
  },
  {
    keys: "Ctrl+D",
    description:
      "Delete the character under the cursor, or exit the shell if the line is empty.",
    context: "readline",
  },
  {
    keys: "Alt+.",
    description: "Insert the last argument of the previous command.",
    context: "readline",
  },
  {
    keys: "Ctrl+T",
    description: "Transpose (swap) the two characters before the cursor.",
    context: "readline",
  },

  // Vi mode (set -o vi)
  {
    keys: "Esc",
    description: "Switch from insert mode to command mode.",
    context: "vi",
  },
  {
    keys: "i",
    description: "Enter insert mode before the cursor.",
    context: "vi",
  },
  {
    keys: "a",
    description: "Enter insert mode after the cursor.",
    context: "vi",
  },
  {
    keys: "0",
    description: "Move to the beginning of the line (command mode).",
    context: "vi",
  },
  {
    keys: "$",
    description: "Move to the end of the line (command mode).",
    context: "vi",
  },
  {
    keys: "w",
    description: "Move forward one word (command mode).",
    context: "vi",
  },
  {
    keys: "b",
    description: "Move back one word (command mode).",
    context: "vi",
  },
  {
    keys: "x",
    description: "Delete the character under the cursor (command mode).",
    context: "vi",
  },
  {
    keys: "dd",
    description: "Delete the entire line (command mode).",
    context: "vi",
  },
  {
    keys: "k / j",
    description:
      "Step backward/forward through command history (command mode).",
    context: "vi",
  },

  // tmux (default prefix: Ctrl+B)
  {
    keys: "Ctrl+B c",
    description: "Create a new window.",
    context: "tmux",
  },
  {
    keys: "Ctrl+B %",
    description: "Split the current pane vertically.",
    context: "tmux",
  },
  {
    keys: 'Ctrl+B "',
    description: "Split the current pane horizontally.",
    context: "tmux",
  },
  {
    keys: "Ctrl+B ←/→/↑/↓",
    description: "Move focus between panes.",
    context: "tmux",
  },
  {
    keys: "Ctrl+B d",
    description: "Detach from the current session, leaving it running.",
    context: "tmux",
  },
  {
    keys: "Ctrl+B z",
    description: "Toggle zoom on the current pane (fill the whole window).",
    context: "tmux",
  },
  {
    keys: "Ctrl+B x",
    description: "Kill the current pane (with confirmation).",
    context: "tmux",
  },
  {
    keys: "Ctrl+B 0-9",
    description: "Switch directly to window number 0 through 9.",
    context: "tmux",
  },
  {
    keys: "Ctrl+B ,",
    description: "Rename the current window.",
    context: "tmux",
  },
  {
    keys: "Ctrl+B w",
    description: "Open an interactive list of windows to choose from.",
    context: "tmux",
  },
];

export const CONTEXT_LABELS: Record<ShortcutContext, string> = {
  readline: "Readline (Emacs editing)",
  vi: "Vi mode",
  tmux: "tmux",
};
