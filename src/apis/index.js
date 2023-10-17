import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import addressesRoutes from "./routes/adddresses.router"

export default () => {
  const router = Router();

  authRoutes(router);
  addressesRoutes(router);
  return router;
};
