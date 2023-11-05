import customersController from "@/apis/controllers/customers.controller";
import isAuth from "@/apis/middlewares/isAuth";

/**
 *
 * @param {import('express').Router} router
 */
const customerRoutes = (router) => {
  router.get("/customers", isAuth, customersController.getCustomerInfo);
};

export default customerRoutes;
