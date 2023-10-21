import { OrderStatus } from "@/lib/constants";
import controllerWrapper from "@/lib/controller.wrapper";
import { cartItemServices } from "@/redis-om/cart";

const ordersController = {
  createOrder: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { id } = req.user;
      const { addressId, shippingFee, couponId } = req.body;
      const cartItems = await cartItemServices.searchCart(id, {
        checked: true,
      });

      if (!cartItems.length) {
        return errorResponse("Cart is empty", 400);
      }

      const [newOrder, newOrderItems] = await sql.begin(async (sql) => {
        const [newOrder] = await sql`
        INSERT INTO orders ${sql({
          customerId: id,
          addressId,
          shippingFee,
          status: OrderStatus.PENDING,
          couponId: couponId || null,
          total: cartItems.reduce(
            (acc, cur) => acc + cur.quantity * cur.price,
            0
          ),
        })} RETURNING id`;

        const newOrderItems = await sql`INSERT INTO order_items ${sql(
          cartItems.map((item) => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))
        )}
        RETURNING id, order_id, product_id, quantity, price
        `;

        // update quantity of product
        await sql`
        UPDATE products SET quantity = products.quantity - CAST(update_data.quantity AS int)
        FROM (VALUES ${sql(
          newOrderItems.map((item) => [item.productId, item.quantity])
        )}) AS update_data (productId, quantity)
        WHERE products.id = CAST(update_data.productId AS int)
        `;

        // remove cart items
        const clearSuccess = await cartItemServices.clearCart(id);

        if (!clearSuccess) {
          throw new Error("Clear cart failed");
        }

        return [newOrder, newOrderItems];
      });

      return successResponse({ newOrder, newOrderItems }, "Order created", 201);
    }
  ),
};

export default ordersController;
