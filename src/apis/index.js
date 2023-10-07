import { Router } from "express";
import authRoutes from "./routes/auth.routes";

export default () => {
  const router = Router();

  authRoutes(router);

  return router;
};
