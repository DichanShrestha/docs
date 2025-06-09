import { initRedisListener } from "@services/saveToDb";

initRedisListener()
  .then(() => console.log("📡 Redis listener started..."))
  .catch((err) => console.error("❌ Failed to start Redis listener:", err));
