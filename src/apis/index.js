import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import addressRoutes from "./routes/adddresses.router"

export default () => {
  const router = Router();

  authRoutes(router);
  addressRoutes(router);
  return router;
};
