import productsController from "@/apis/controllers/products.controller";

/**
 *
 * @param {import('express').Router} router
 */
const productsRoutes = (router) => {
  router.get("/products/:slug", productsController.getProductDetails);
  router.get("/products", productsController.getProducts);
  router.get(
    "/products/categories/:slug",
    productsController.getProductByCategory
  );
};

export default productsRoutes;
