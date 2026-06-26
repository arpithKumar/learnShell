export const SITE_NAME = "learnshell";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnshell.dev";

// Tolerate a value entered without a scheme (e.g. just "example.com"),
// which would otherwise throw inside `new URL(...)` wherever SITE_URL is used,
// and strip any trailing slash so string concatenation elsewhere doesn't double up.
const withScheme = /^https?:\/\//.test(rawSiteUrl)
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;
export const SITE_URL = withScheme.replace(/\/+$/, "");

export const SITE_DESCRIPTION =
  "Every shell command, flag, and shortcut — explained and explorable.";
