import Redis from "ioredis";

const publisher = new Redis("redis://redis:6379");

export const publishMessage = (channel: string, message: string) => {
  publisher.publish(channel, message, (error, result) => {
    if (error) {
      console.error(`Error publishing message to channel ${channel}:`, error);
    } else {
      console.log(`Message published to channel ${channel}:`, message);
    }
  });
};
