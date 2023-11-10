import { body, param } from "express-validator";
import cartController from "../controllers/cart.controller";
import isAuth from "../middlewares/isAuth";

const cartRoutes = (router) => {
  router.get("/carts", isAuth, cartController.getAllCartItem);
  router.get("/carts/length", isAuth, cartController.getCartLength);

  router.post(
    "/carts",
    isAuth,
    body("productId")
      .isInt({
        min: 1,
      })
      .withMessage("Product id must be a positive integer"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    cartController.addToCart
  );

  router.patch(
    "/carts/:productId/quantity",
    isAuth,
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    param("productId")
      .isInt({ min: 1 })
      .withMessage("Product id must be a positive integer"),
    cartController.updateCartItemQuantity
  );

  router.patch(
    "/carts/:productId/toggle",
    isAuth,
    param("productId")
      .isInt({ min: 1 })
      .withMessage("Product id must be a positive integer"),
    cartController.toggleCheckedCartItem
  );
};

export default cartRoutes;
