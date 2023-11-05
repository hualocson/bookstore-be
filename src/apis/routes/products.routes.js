import productsController from "@/apis/controllers/products.controller";

/**
 *
 * @param {import('express').Router} router
 */
const productsRoutes = (router) => {
  router.get("/products", productsController.getProducts);
};

export default productsRoutes;
