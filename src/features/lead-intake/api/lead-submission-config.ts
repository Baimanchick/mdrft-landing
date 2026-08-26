import "server-only";

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function isLeadSubmissionEnabled(): boolean {
  return process.env.LEAD_SUBMISSION_ENABLED?.trim().toLowerCase() === "true";
}

export function getLeadAllowedOrigin(): string | undefined {
  const value = process.env.LEAD_ALLOWED_ORIGIN?.trim();

  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    const hasAllowedProtocol =
      url.protocol === "https:" || (url.protocol === "http:" && isLocalHostname(url.hostname));
    const isOriginOnly =
      url.username === "" &&
      url.password === "" &&
      url.pathname === "/" &&
      url.search === "" &&
      url.hash === "";

    return hasAllowedProtocol && isOriginOnly ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
