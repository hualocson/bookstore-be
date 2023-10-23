import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import addressesRoutes from "./routes/addresses.routes"
import customerDetailRoutes from "./routes/customer_details.router"
import cartRoutes from "./routes/cart.routes";

export default () => {
  const router = Router();

  authRoutes(router);
  addressesRoutes(router);
  customerDetailRoutes(router);
  cartRoutes(router);
  return router;
};
