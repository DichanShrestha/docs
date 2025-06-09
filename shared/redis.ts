import { Redis } from "ioredis";

export const redisClient = new Redis("redis://redis:6379");
