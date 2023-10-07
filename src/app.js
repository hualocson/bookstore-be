import express from "express";

import loaders from "@/loaders/express";

const startApp = () => {
  const app = express();
  loaders(app);
  return app;
};

export default startApp;
