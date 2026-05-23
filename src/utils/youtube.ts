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
}

export async function fetchYouTubeTranscriptEn(
  url: string,
): Promise<YouTubeTranscriptResult> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube link. Paste a full URL or 11-character video ID.");
  }

  const response = await fetch(
    `/api/youtube/transcript?videoId=${encodeURIComponent(videoId)}`,
  );

  const payload = (await response.json()) as {
    text?: string;
    segments?: number;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? "Could not load English transcript.");
  }

  if (!payload.text?.trim()) {
    throw new Error("Transcript is empty. The video may not have English captions.");
  }

  return {
    text: payload.text.trim(),
    segments: payload.segments ?? 0,
    videoId,
  };
}
