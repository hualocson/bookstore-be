import express from "express";

import expressLoader from "@/loaders/express";
import loadRedisStore from "@/loaders/redis";

const startApp = () => {
  const app = express();
  loadRedisStore();
  expressLoader(app);
  return app;
};

export default startApp;
