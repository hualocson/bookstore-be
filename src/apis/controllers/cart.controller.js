import controllerWrapper from "@/lib/controller.wrapper";
import { cartItemServices } from "@/redis-om/cart";

const cartController = {
  // Add new product to redis cart
  addToCart: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { id } = req.user;
      const { productId, quantity } = req.body;

      // get product price
      const [product] = await sql`
        SELECT price FROM products WHERE id = ${productId}
      `;
      if (!product) {
        return errorResponse("Product not found", 404);
      }

      const cartItem = await cartItemServices.saveCart({
        userId: id,
        productId,
        quantity,
        checked: true,
        price: product.price,
      });

      if (!cartItem) {
        return errorResponse("Failed to add item to cart", 400);
      }

      return successResponse({ cartItem }, "Item added to cart");
    }
  ),

  updateCartItemQuantity: controllerWrapper(
    async (req, res, { successResponse, errorResponse }) => {
      const { id } = req.user;
      const { productId } = req.params;
      const { quantity } = req.body;

      const cartItem = await cartItemServices.updateQuantityCartItem(
        id,
        productId,
        quantity
      );

      if (!cartItem) {
        return errorResponse("Item not in cart.", 400);
      }

      return successResponse({ cartItem }, "Cart item updated");
    }
  ),

  toggleCheckedCartItem: controllerWrapper(
    async (req, res, { successResponse, errorResponse }) => {
      const { id } = req.user;
      const { productId } = req.params;

      const cartItem = await cartItemServices.toggleCheckedCartItem(
        id,
        productId
      );

      if (!cartItem) {
        return errorResponse("Item not in cart.", 400);
      }

      return successResponse({ cartItem }, "Cart item updated");
    }
  ),

  getAllCartItem: controllerWrapper(async (req, res, { successResponse }) => {
    const { id } = req.user;

    const cartItems = await cartItemServices.searchCart(id);

    return successResponse({ cartItems }, "Cart items retrieved");
  }),
};

export default cartController;