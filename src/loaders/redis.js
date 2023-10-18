import redisClient from "@/configs/redis";
import logger from "@/configs/logger";
import { createIndex } from "@/redis-om/libs";

const loadRedisStore = async () => {
  redisClient.on("error", (err) => {
    logger.error(`Redis error: ${err}`);
  });

  redisClient
    .connect()
    .then(() => {
      logger.info("Redis connected.");
    })
    .catch((err) => {
      logger.error(`Redis connect error: ${err}`);
    });

  await createIndex();
};

export default loadRedisStore;
