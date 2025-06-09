import Redis from "ioredis";

export const subscriber = new Redis("redis://redis:6379");

export const subscribeToChannel = (
  channel: string,
  callback: (message: string) => void
) => {
  subscriber.subscribe(channel, (err, count) => {
    if (err) {
      console.error(`❌ Failed to subscribe to ${channel}:`, err);
    } else {
      console.log(`✅ Subscribed to ${channel} (${count} total subscriptions)`);
    }
  });

  // Listen for messages
  subscriber.on("message", (chan, message) => {
    if (chan === channel) {
      console.log(`📬 Received message from ${channel}:`, message);
      callback(message);
    }
  });
};
