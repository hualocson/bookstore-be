import express from "express";

import expressLoader from "@/loaders/express";
import loadRedisStore from "@/loaders/redis";

const startApp = async () => {
  const app = express();
  await loadRedisStore();
  expressLoader(app);
  return app;
};

export default startApp;
