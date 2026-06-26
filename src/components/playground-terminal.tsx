"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { usePlaygroundStore } from "@/lib/playground/store";
import { applyCompletion, getCompletions } from "@/lib/playground/autocomplete";

const ESC = String.fromCharCode(27);
const BACKSPACE = String.fromCharCode(127);
const ENTER = String.fromCharCode(13);
const TAB = String.fromCharCode(9);

const KEY_UP = `${ESC}[A`;
const KEY_DOWN = `${ESC}[B`;
const KEY_RIGHT = `${ESC}[C`;
const KEY_LEFT = `${ESC}[D`;

const PROMPT_COLOR = `${ESC}[32m`;
const RESET_COLOR = `${ESC}[0m`;
const CLEAR_SCREEN = `${ESC}[2J${ESC}[H`;

function prompt(cwd: string) {
  return `${PROMPT_COLOR}${cwd}${RESET_COLOR} $ `;
}

export function PlaygroundTerminal({
  initialCommand,
}: {
  initialCommand?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Guards against React Strict Mode's dev-only mount→cleanup→remount
    // cycle: if a previous xterm instance left any DOM behind in this
    // container, clear it before creating a new one, so we never end up
    // with two terminals stacked on top of each other.
    container.innerHTML = "";

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      fontFamily: "var(--font-mono), monospace",
      fontSize: 13,
      theme: {
        background: "#0a0a0a",
        foreground: "#e5e5e5",
        cursor: "#5fd98a",
      },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);
    fitAddon.fit();

    const onResize = () => fitAddon.fit();
    window.addEventListener("resize", onResize);

    let buffer = "";
    let cursor = 0;
    let historyIndex = usePlaygroundStore.getState().history.length;

    function redraw() {
      const cwd = usePlaygroundStore.getState().cwd;
      term.write(`\r${ESC}[K` + prompt(cwd) + buffer);
      const back = buffer.length - cursor;
      if (back > 0) term.write(`${ESC}[${back}D`);
    }

    function newPrompt() {
      const cwd = usePlaygroundStore.getState().cwd;
      term.write("\r\n" + prompt(cwd));
    }

    function runLine(line: string) {
      const output = usePlaygroundStore.getState().runCommand(line);
      if (output === CLEAR_SCREEN) {
        term.write(output);
        return;
      }
      if (output) {
        term.write("\r\n" + output.replace(/\n/g, "\r\n").replace(/\r\n$/, ""));
      }
    }

    term.write(
      "learnshell playground — type 'help' for available commands\r\n",
    );
    term.write(prompt(usePlaygroundStore.getState().cwd));

    if (initialCommand) {
      runLine(initialCommand);
      historyIndex = usePlaygroundStore.getState().history.length;
      newPrompt();
    }

    const dataListener = term.onData((data) => {
      const history = usePlaygroundStore.getState().history;

      if (data === ENTER) {
        const line = buffer;
        buffer = "";
        cursor = 0;
        runLine(line);
        historyIndex = usePlaygroundStore.getState().history.length;
        newPrompt();
        return;
      }

      if (data === BACKSPACE) {
        if (cursor > 0) {
          buffer = buffer.slice(0, cursor - 1) + buffer.slice(cursor);
          cursor--;
          redraw();
        }
        return;
      }

      if (data === KEY_UP) {
        if (historyIndex > 0) {
          historyIndex--;
          buffer = history[historyIndex] ?? "";
          cursor = buffer.length;
          redraw();
        }
        return;
      }

      if (data === KEY_DOWN) {
        if (historyIndex < history.length) {
          historyIndex++;
          buffer = history[historyIndex] ?? "";
          cursor = buffer.length;
          redraw();
        }
        return;
      }

      if (data === KEY_RIGHT) {
        if (cursor < buffer.length) {
          cursor++;
          redraw();
        }
        return;
      }

      if (data === KEY_LEFT) {
        if (cursor > 0) {
          cursor--;
          redraw();
        }
        return;
      }

      if (data === TAB) {
        const { vfs, cwd } = usePlaygroundStore.getState();
        const completion = getCompletions(buffer, cursor, vfs, cwd);
        const applied = applyCompletion(buffer, completion);
        if (!applied) return;

        if (applied.listing.length > 0) {
          term.write("\r\n" + applied.listing.join("  "));
          newPrompt();
          term.write(buffer);
        } else {
          buffer = applied.buffer;
          cursor = applied.cursor;
          redraw();
        }
        return;
      }

      if (data >= " ") {
        buffer = buffer.slice(0, cursor) + data + buffer.slice(cursor);
        cursor += data.length;
        redraw();
      }
    });

    return () => {
      window.removeEventListener("resize", onResize);
      dataListener.dispose();
      term.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[28rem] overflow-hidden rounded-xl border bg-[#0a0a0a] p-2"
    />
  );
}
