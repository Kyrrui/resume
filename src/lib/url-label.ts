// Picks the right CTA label for a project's primary URL. Repo links get
// "GitHub"; everything else is treated as a live site.

export function urlLabel(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === "github.com" || host.endsWith(".github.com")) return "GitHub";
  } catch {
    // Fall through to the default for malformed URLs.
  }
  return "Live";
}
