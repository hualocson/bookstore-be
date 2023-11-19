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
          total:
            cartItems.reduce((acc, cur) => acc + cur.quantity * cur.price, 0) +
            parseInt(shippingFee, 10),
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

        // update quantity of product and sold of product
        await sql`
        UPDATE products SET quantity = products.quantity - CAST(update_data.quantity AS int), sold = products.sold + CAST(update_data.quantity AS int)
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

  getOrders: controllerWrapper(async (req, res, { successResponse, sql }) => {
    const { id } = req.user;

    const orders = await sql`
        SELECT orders.id, orders.status, orders.total, orders.created_at
        FROM orders
        WHERE orders.customer_id = ${id}
        ORDER BY orders.created_at DESC
      `;

    // query order items
    const orderIds = orders.map((order) => order.id);
    const orderItems = await sql`
        SELECT order_items.id, order_items.product_id, order_items.order_id, p.name, p.image, p.slug, pd.author, order_items.quantity, order_items.price, o.canceled_at, o.completed_at, o.delivery_at
        FROM order_items
        LEFT JOIN orders o ON order_items.order_id = o.id
        LEFT JOIN products p ON order_items.product_id = p.id
        LEFT JOIN product_details pd ON p.id = pd.id
        WHERE order_items.order_id IN ${sql(orderIds)}
      `;

    // group order items by order id
    const orderItemsMap = orderItems.reduce((acc, cur) => {
      const { orderId, ...rest } = cur;
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(rest);
      return acc;
    }, {});

    return successResponse(
      { orders, orderItems: orderItemsMap },
      "Get all orders",
      200
    );
  }),
};

export default ordersController;
