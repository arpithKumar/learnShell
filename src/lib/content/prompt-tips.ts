export type PromptTip = {
  title: string;
  description: string;
  example?: string;
};

export type PromptTipGroup = {
  category: string;
  tips: PromptTip[];
};

export const PROMPT_TIP_GROUPS: PromptTipGroup[] = [
  {
    category: "Setting context",
    tips: [
      {
        title: "Say what you're building before asking for the fix",
        description:
          "A one-line project summary lets the model rule out irrelevant approaches immediately, instead of guessing your stack from the error message alone.",
        example:
          "This is a Next.js API route using Prisma — the query below is timing out on our staging DB.",
      },
      {
        title: "Point at files instead of re-describing them",
        description:
          "If the assistant can read your repo, reference the exact file/function rather than summarizing what it does from memory — summaries drift out of date, the file doesn't.",
      },
    ],
  },
  {
    category: "Being specific",
    tips: [
      {
        title: "State constraints up front, not after the first attempt",
        description:
          "\"No new dependencies\", \"must stay under 50 lines\", \"can't change the public API\" — constraints given after the fact cause wasted rework.",
      },
      {
        title: "Name the failure, not just the symptom",
        description:
          "\"It's broken\" forces the model to guess what to check first. \"Returns 500 when the array is empty\" tells it exactly where to look.",
        example:
          "Bad: the login form doesn't work. Better: submitting with an empty password field throws a 500 instead of showing a validation error.",
      },
    ],
  },
  {
    category: "Iterating",
    tips: [
      {
        title: "Ask for a plan before a large change",
        description:
          "For anything touching multiple files or with more than one reasonable approach, ask the assistant to outline its plan first — cheap to redirect a plan, expensive to redirect finished code.",
      },
      {
        title: "Correct explicitly, don't just say \"try again\"",
        description:
          "\"That's wrong, try again\" repeats the same mistake. Naming what was wrong (\"you mutated the original array\") fixes it and prevents it recurring later in the same conversation.",
      },
    ],
  },
  {
    category: "Using examples",
    tips: [
      {
        title: "Show the shape you want, not just describe it",
        description:
          "One concrete input/output example resolves ambiguity that paragraphs of description often can't — especially for formatting, naming conventions, or data shapes.",
        example:
          "Format each row as `[slug] name — summary`, e.g. `[grep] grep — Search text using patterns and print matching lines.`",
      },
      {
        title: "Point to existing code as the style reference",
        description:
          "\"Match the pattern in command-card.tsx\" is more reliable than describing a coding style in prose, since the assistant can read the actual conventions instead of inferring them from your description.",
      },
    ],
  },
  {
    category: "Managing large tasks",
    tips: [
      {
        title: "Break multi-step work into checkpoints",
        description:
          "Ask for one coherent piece at a time (data layer, then UI, then wiring) rather than \"build the whole feature\" — easier to review, easier to redirect if something's off early.",
      },
      {
        title: "Say when something is out of scope",
        description:
          "If you don't want a bug fix to also refactor surrounding code, say so — otherwise \"clean up while you're in there\" is a very natural default for an agent that can see the mess.",
      },
    ],
  },
  {
    category: "Giving feedback",
    tips: [
      {
        title: "Confirm what worked, not just what didn't",
        description:
          "If an unusual approach was correct, say so explicitly. Assistants with memory of the conversation (or persistent memory across sessions) use that signal to keep making the same good call instead of second-guessing it later.",
      },
    ],
  },
];
