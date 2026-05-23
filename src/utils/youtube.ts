export function extractYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;

      const embed = parsed.pathname.match(/\/embed\/([\w-]{11})/);
      if (embed) return embed[1];

      const shorts = parsed.pathname.match(/\/shorts\/([\w-]{11})/);
      if (shorts) return shorts[1];
    }
  } catch {
    return null;
  }

  return null;
}

export interface YouTubeTranscriptResult {
  text: string;
  segments: number;
  videoId: string;
  lang: string;
}

function isEnglishLang(lang: string): boolean {
  return lang === "en" || lang.startsWith("en-");
}

export function shouldForceEnglishSummary(lang: string): boolean {
  return isEnglishLang(lang);
}

async function readTranscriptPayload(
  response: Response,
): Promise<{ text?: string; segments?: number; lang?: string; error?: string }> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "YouTube transcript API unavailable. On Vercel, redeploy after pulling latest; locally use npm run dev.",
    );
  }

  return (await response.json()) as {
    text?: string;
    segments?: number;
    lang?: string;
    error?: string;
  };
}

export async function fetchYouTubeTranscript(
  url: string,
): Promise<YouTubeTranscriptResult> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube link. Paste a full URL or 11-character video ID.");
  }

  let response: Response;
  try {
    response = await fetch(
      `/api/youtube/transcript?videoId=${encodeURIComponent(videoId)}`,
    );
  } catch {
    throw new Error(
      "Could not reach the transcript API. Check your connection or try again later.",
    );
  }

  const payload = await readTranscriptPayload(response);

  if (!response.ok) {
    const message = payload.error?.replace(/^\[YoutubeTranscript\]\s*🚨\s*/, "");
    throw new Error(message ?? "Could not load transcript.");
  }

  if (!payload.text?.trim()) {
    throw new Error("Transcript is empty. The video may not have captions.");
  }

  return {
    text: payload.text.trim(),
    segments: payload.segments ?? 0,
    videoId,
    lang: payload.lang ?? "unknown",
  };
}

/** @deprecated Use fetchYouTubeTranscript */
export const fetchYouTubeTranscriptEn = fetchYouTubeTranscript;
