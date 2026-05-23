import { YoutubeTranscript } from "youtube-transcript";

const PREFERRED_LANGS = ["en", "ru", "uk", "de", "fr", "es", "pt", "it"];
const VIDEO_ID_RE = /^[\w-]{11}$/;

export type TranscriptPayload = { text: string; segments: number; lang: string };

export function parseVideoId(raw: string | undefined): string | null {
  const videoId = raw?.trim();
  if (!videoId || !VIDEO_ID_RE.test(videoId)) return null;
  return videoId;
}

function stripYoutubeErrorPrefix(message: string): string {
  return message.replace(/^\[YoutubeTranscript\]\s*🚨\s*/, "");
}

function parseAvailableLanguages(message: string): string[] {
  const match = message.match(/Available languages:\s*([^\n]+)/i);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

function chunksToText(
  chunks: Awaited<ReturnType<typeof YoutubeTranscript.fetchTranscript>>,
): string {
  return chunks
    .map((c) => c.text.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

async function tryFetchLang(
  videoId: string,
  lang?: string,
): Promise<TranscriptPayload | null> {
  const chunks = await YoutubeTranscript.fetchTranscript(
    videoId,
    lang ? { lang } : undefined,
  );

  if (!chunks.length) return null;

  const resolvedLang = chunks[0]?.lang ?? lang ?? "unknown";
  return {
    text: chunksToText(chunks),
    segments: chunks.length,
    lang: resolvedLang,
  };
}

export async function fetchTranscriptForVideo(
  videoId: string,
): Promise<TranscriptPayload> {
  const tried = new Set<string>();
  const errors: string[] = [];

  const attempt = async (lang?: string): Promise<TranscriptPayload | null> => {
    const key = lang ?? "*";
    if (tried.has(key)) return null;
    tried.add(key);

    try {
      return await tryFetchLang(videoId, lang);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch transcript";
      errors.push(stripYoutubeErrorPrefix(message));

      for (const code of parseAvailableLanguages(message)) {
        if (tried.has(code)) continue;
        tried.add(code);
        try {
          const result = await tryFetchLang(videoId, code);
          if (result) return result;
        } catch (inner) {
          const innerMessage =
            inner instanceof Error ? inner.message : "Failed to fetch transcript";
          errors.push(stripYoutubeErrorPrefix(innerMessage));
        }
      }

      return null;
    }
  };

  for (const lang of PREFERRED_LANGS) {
    const result = await attempt(lang);
    if (result) return result;
  }

  const fallback = await attempt(undefined);
  if (fallback) return fallback;

  const detail = errors.at(-1);
  throw new Error(
    detail ?? "No captions found for this video. Enable subtitles on YouTube.",
  );
}
