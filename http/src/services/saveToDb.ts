import Redis from "ioredis";
import dbConnect from "../lib/dbConnect";
import { DocsModel } from "../model/docs.model";

const redisClient = new Redis(process.env.REDIS_URL || "redis://redis:6379");

// Optional: Throttle map to avoid saving too frequently (not used here yet)
const lastSavedMap: Record<string, number> = {};

export const initRedisListener = async () => {
  await dbConnect();
  console.log("📡 Redis listener started in http...");

  await redisClient.psubscribe("doc-id:*");

  redisClient.on("pmessage", async (_pattern, channel, message) => {
    console.log("Received message on channel in http:", channel);

    const docId = channel.split(":")[1]?.trim();
    if (!docId) {
      console.warn("⚠️ Invalid docId in channel:", channel);
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch (err) {
      console.error("❌ Failed to parse Redis message:", message, err);
      return;
    }

    const content = parsed?.message ?? "";

    console.log("Parsed content to save:", content);

    try {
      const docs = await DocsModel.findByIdAndUpdate(
        docId,
        { content },
        { upsert: true }
      );
      console.log(docs);
      console.log(`✅ Saved doc ${docId}`);
    } catch (err) {
      console.error(`❌ Failed to save doc ${docId}:`, err);
    }
  });
};
