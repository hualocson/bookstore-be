import categoriesRoutes from "@/apis/routes/categories.routes";
import customerRoutes from "@/apis/routes/customers.routes";
import favoritesRoutes from "@/apis/routes/favorites.routes";
import productsRoutes from "@/apis/routes/products.routes";
import { Router } from "express";
import addressesRoutes from "./routes/addresses.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import couponsRoutes from "./routes/coupons.routes";
import customerDetailRoutes from "./routes/customer_details.routes";
import ordersRoutes from "./routes/orders.routes";

export default () => {
  const router = Router();

  authRoutes(router);
  addressesRoutes(router);
  customerDetailRoutes(router);
  cartRoutes(router);
  ordersRoutes(router);
  couponsRoutes(router);
  productsRoutes(router);
  categoriesRoutes(router);
  customerRoutes(router);
  favoritesRoutes(router);
  return router;
};
