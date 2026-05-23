import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  fetchTranscriptForVideo,
  parseVideoId,
} from "../../server/youtubeTranscript.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const videoId = parseVideoId(
    typeof req.query.videoId === "string"
      ? req.query.videoId
      : Array.isArray(req.query.videoId)
        ? req.query.videoId[0]
        : undefined,
  );

  if (!videoId) {
    return res.status(400).json({ error: "Invalid videoId" });
  }

  try {
    const result = await fetchTranscriptForVideo(videoId);
    return res.status(200).json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch transcript";
    return res.status(502).json({ error: message });
  }
}
