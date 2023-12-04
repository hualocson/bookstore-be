import favoritesController from "@/apis/controllers/favorites.controller";
import isAuth from "@/apis/middlewares/isAuth";

/**
 *
 * @param {import('express').Router} router
 */
const favoritesRoutes = (router) => {
  router.post("/favorites", isAuth, favoritesController.addToFavorites);

  router.get(
    "/favorites/length",
    isAuth,
    favoritesController.getFavoritesLength
  );
  router.get("/favorites", isAuth, favoritesController.getFavorites);

  router.delete("/favorites/:id", isAuth, favoritesController.deleteFavorite);
};

export default favoritesRoutes;
