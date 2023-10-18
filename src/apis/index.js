import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";

export default () => {
  const router = Router();

  authRoutes(router);
  cartRoutes(router);

  return router;
};
