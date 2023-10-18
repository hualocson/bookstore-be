import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import addressesRoutes from "./routes/adddresses.router"
import cartRoutes from "./routes/cart.routes";

export default () => {
  const router = Router();

  authRoutes(router);
  addressesRoutes(router);
  cartRoutes(router);
  return router;
};
