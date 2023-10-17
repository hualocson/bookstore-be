import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import addressesRoutes from "./routes/adddresses.router"
import customerDetailRoutes from "./routes/customer_details.router"
export default () => {
  const router = Router();

  authRoutes(router);
  addressesRoutes(router);
  customerDetailRoutes(router);
  return router;
};
