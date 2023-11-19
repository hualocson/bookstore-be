import ordersController from "../controllers/orders.controller";
import isAuth from "../middlewares/isAuth";

/**
 *
 * @param {import("express").Router} router
 */
const ordersRoutes = (router) => {
  router.get("/orders", isAuth, ordersController.getOrders);

  router.post("/orders", isAuth, ordersController.createOrder);
};

export default ordersRoutes;
