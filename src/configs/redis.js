import { createClient } from "redis";
import configs from "@/configs/vars.js";

const redisClient = createClient({
  socket: {
    host: configs.redisHost,
    port: configs.redisPort,
  },
  password: configs.redisPassword,
});

export default redisClient;
