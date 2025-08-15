import Redis from "ioredis";

export const redis = process.env.NODE_ENV === "test" ? null : new Redis();
