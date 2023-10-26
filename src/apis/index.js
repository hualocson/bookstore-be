import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import addressesRoutes from "./routes/addresses.routes";
import customerDetailRoutes from "./routes/customer_details.routes";
import cartRoutes from "./routes/cart.routes";
import ordersRoutes from "./routes/orders.routes";
import couponsRoutes from "./routes/coupons.routes";
export default () => {
  const router = Router();

  authRoutes(router);
  addressesRoutes(router);
  customerDetailRoutes(router);
  cartRoutes(router);
  ordersRoutes(router);
  couponsRoutes(router);
  return router;
};
