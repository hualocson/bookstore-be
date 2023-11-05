import categoriesController from "@/apis/controllers/categories.controller";

/**
 *
 * @param {import('express').Router} router
 */
const categoriesRoutes = (router) => {
  router.get("/categories", categoriesController.getCategories);
};

export default categoriesRoutes;
