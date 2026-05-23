import type { ServerResponse } from "node:http";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";
import { YoutubeTranscript } from "youtube-transcript";

function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function handleTranscript(
  videoId: string,
): Promise<{ text: string; segments: number }> {
  const chunks = await YoutubeTranscript.fetchTranscript(videoId, {
    lang: "en",
  });

  if (!chunks.length) {
    throw new Error("No English captions found for this video.");
  }

  const text = chunks
    .map((c) => c.text.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");

  return { text, segments: chunks.length };
}

function attachMiddleware(middlewares: ViteDevServer["middlewares"]) {
  middlewares.use("/api/youtube/transcript", async (req, res) => {
    if (req.method !== "GET") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    const url = new URL(req.url ?? "", "http://localhost");
    const videoId = url.searchParams.get("videoId")?.trim();

    if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
      sendJson(res, 400, { error: "Invalid videoId" });
      return;
    }

    try {
      const result = await handleTranscript(videoId);
      sendJson(res, 200, result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch transcript";
      sendJson(res, 502, { error: message });
    }
  });
}

export function youtubeTranscriptApi(): Plugin {
  return {
    name: "youtube-transcript-api",
    configureServer(server: ViteDevServer) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server: PreviewServer) {
      attachMiddleware(server.middlewares);
    },
  };
}
