import controllerWrapper from "@/lib/controller.wrapper";
import { cartItemServices } from "@/redis-om/cart";

const cartController = {
  // Add new product to redis cart
  addToCart: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { id } = req.user;
      const { productId, quantity, checked } = req.body;

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
        checked: checked ?? false,
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
        return errorResponse("Item not in cart.", 404);
      }

      return successResponse({ cartItem }, "Cart item updated");
    }
  ),

  toggleAllCartItems: controllerWrapper(
    async (req, res, { successResponse }) => {
      const { id } = req.user;
      const { checked } = req.body;

      const cart = await cartItemServices.toggleAllCartItems(id, checked);

      return successResponse({ cart }, "Cart updated");
    }
  ),

  getAllCartItem: controllerWrapper(
    async (req, res, { sql, successResponse }) => {
      const { id } = req.user;

      const cartItems = await cartItemServices.searchCart(id);
      const itemDetails = await sql`
        SELECT p.id, p.name, p.image, pd.author FROM products p
        LEFT JOIN product_details pd ON pd.id = p.id
        WHERE p.id IN ${sql(cartItems.map((item) => item.productId))}
      `;

      cartItems.forEach((item) => {
        const itemDetail = itemDetails.find(
          (detail) => detail.id === item.productId
        );
        item.name = itemDetail.name;
        item.author = itemDetail.author;
        item.image = itemDetail.image;
      });

      return successResponse({ cartItems }, "Cart items retrieved");
    }
  ),

  getCartLength: controllerWrapper(async (req, res, { successResponse }) => {
    const { id } = req.user;

    const cartItems = await cartItemServices.searchCart(id);

    return successResponse(
      { length: cartItems.length },
      "Cart items retrieved"
    );
  }),
  removeCartItem: controllerWrapper(
    async (req, res, { successResponse, errorResponse }) => {
      const { id } = req.user;
      const { productId } = req.params;

      const isSuccess = await cartItemServices.removeCartItem(id, productId);

      if (!isSuccess) {
        return errorResponse("Item not in cart.", 404);
      }

      return successResponse({}, "Cart item removed");
    }
  ),
};

export default cartController;
