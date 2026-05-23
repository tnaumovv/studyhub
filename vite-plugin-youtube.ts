import type { ServerResponse } from "node:http";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";
import {
  fetchTranscriptForVideo,
  parseVideoId,
} from "./server/youtubeTranscript";

function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function attachMiddleware(middlewares: ViteDevServer["middlewares"]) {
  middlewares.use("/api/youtube/transcript", async (req, res) => {
    if (req.method !== "GET") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    const url = new URL(req.url ?? "", "http://localhost");
    const videoId = parseVideoId(url.searchParams.get("videoId") ?? undefined);

    if (!videoId) {
      sendJson(res, 400, { error: "Invalid videoId" });
      return;
    }

    try {
      const result = await fetchTranscriptForVideo(videoId);
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
