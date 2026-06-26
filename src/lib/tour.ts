import { driver, type DriveStep, type Driver } from "driver.js";
import "driver.js/dist/driver.css";

let activeDriver: Driver | null = null;

function runTour(steps: DriveStep[], storageKey: string) {
  // Two tours can independently decide to fire on the same cold pageview
  // (e.g. landing directly on a command page before ever seeing the
  // homepage tour). Only one driver.js overlay can sanely exist at once.
  if (activeDriver?.isActive()) return;

  activeDriver = driver({
    showProgress: true,
    overlayOpacity: 0.6,
    steps,
    onDestroyed: () => {
      // Mark "seen" only once the tour actually ran and was closed/finished
      // — never before. Setting this preemptively (e.g. right when the
      // trigger component mounts) permanently burns the flag even if the
      // tour never actually rendered, with no way to retry.
      localStorage.setItem(storageKey, "1");
      activeDriver = null;
    },
  });
  activeDriver.drive();
}

export function startTour() {
  runTour(
    [
      {
        element: "#tour-search",
        popover: {
          title: "Jump anywhere, instantly",
          description:
            "Press ⌘K (or Ctrl+K) from any page to fuzzy-search every command, flag, and concept.",
        },
      },
      {
        element: "#tour-nav-catalogue",
        popover: {
          title: "Browse the catalogue",
          description:
            "Filter by category and difficulty level to find exactly what you need.",
        },
      },
      {
        element: "#tour-nav-shortcuts",
        popover: {
          title: "Keyboard shortcuts",
          description:
            "Readline, vi mode, and tmux bindings — with an interactive demo you can click through.",
        },
      },
      {
        element: "#tour-library",
        popover: {
          title: "Build your own cheat sheet",
          description:
            "Bookmark any command here, then export everything you've saved as Markdown — see it in full on the Bookmarks page.",
        },
      },
      {
        element: "#tour-theme",
        popover: {
          title: "Light or dark",
          description:
            "Switch the theme any time — your preference is remembered.",
        },
      },
    ],
    "learnshell-tour-seen",
  );
}

export function startCommandPageTour() {
  runTour(
    [
      {
        element: "#tour-bookmark",
        popover: {
          title: "Save it for later",
          description:
            "Bookmark this command to add it to your personal cheat sheet — accessible from the library icon in the header.",
        },
      },
      {
        element: "#tour-tabs",
        popover: {
          title: "Everything in one place",
          description:
            "Flags has a live builder — click flags to construct a real command. Examples with a pipe (|) animate as connected stages instead of a flat code block.",
        },
      },
      {
        element: "#tour-sidebar",
        popover: {
          title: "At a glance",
          description:
            "A quick stat summary and related commands, so you don't have to dig through tabs to see what's here.",
        },
      },
    ],
    "learnshell-tour-command-seen",
  );
}

export function startShortcutsPageTour() {
  runTour(
    [
      {
        element: "#tour-readline-stage",
        popover: {
          title: "Try it yourself",
          description:
            "Click a shortcut and watch the cursor and text respond, the way it would in a real bash/zsh prompt.",
        },
      },
      {
        element: "#tour-shortcuts-filter",
        popover: {
          title: "Filter by context",
          description:
            "Switch between readline, vi mode, and tmux bindings to narrow the list down.",
        },
      },
    ],
    "learnshell-tour-shortcuts-seen",
  );
}
