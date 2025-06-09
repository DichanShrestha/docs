import express from "express";
import http from "http";
import { Server } from "socket.io";
import { publishMessage } from "./lib/redis/pub";
import { subscribeToChannel } from "./lib/redis/sub";
import { redisClient } from "./lib/redis/redis";
import { storeDocInDb } from "./controllers/docs.controllers";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const redisSubscriptions = new Map();

console.log("connected to ws server on port: ", process.env.APP_NAME);

io.on("connection", (socket) => {
  console.log("New ws client: ", socket.id, process.env.APP_NAME);

  socket.on("subscribe", (data) => {
    const { channel } = data;

    if (!redisSubscriptions.has(channel)) {
      console.log("Subscribing to channel: ", channel);
      redisSubscriptions.set(channel, true); // Mark as subscribed

      subscribeToChannel(channel, (message) => {
        const parsedMessage = JSON.parse(message);
        io.emit(channel, {
          channel,
          message: parsedMessage,
          nodeId: process.env.NODE_ID,
        });
      });
    }
  });

  // function extractDocId(channel: string): string | null {
  //   const match = channel.match(/^doc-id:\s*(\w+)$/);
  //   return match ? match[1] : null;
  // }

  // Handle publish event
  socket.on("publish", async (data) => {
    publishMessage(
      data.channel,
      JSON.stringify({
        message: data,
        senderId: socket.id,
      })
    );
    console.log("Published message to channel: ", data.channel);
    // if (now - lastSavedAt > 120000) {
    //   // 2 minutes
    //   const id = extractDocId(data.channel);
    //   storeDocInDb({
    //     id,
    //     content: data.message.content[0].content[0].text,
    //   }).then(() => console.log("✅ Document saved successfully"));
    // }

    try {
      await redisClient.set(
        data.channel,
        data.message.content[0].content[0].text
      );
      console.log(`✅ Redis saved for channel ${data.channel}`);
    } catch (err) {
      console.error(
        `❌ Failed to save to Redis for channel ${data.channel}:`,
        err
      );
    }
  });
});

server.listen(process.env.WS_PORT || 8000, () => {
  console.log(
    `WebSocket server is running on port ${process.env.WS_PORT} on node ${process.env.NODE_ID}`
  );
});
