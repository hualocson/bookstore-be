import redisClient from "@/configs/redis";
import logger from "@/configs/logger";

const loadRedisStore = () => {
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
};

export default loadRedisStore;
