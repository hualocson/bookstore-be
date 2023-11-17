import redisClient from "@/configs/redis";
import { Repository, Schema } from "redis-om";

const cartItemSchema = new Schema("cartItem", {
  userId: { type: "number" },
  productId: { type: "number" },
  quantity: { type: "number" },
  price: { type: "number" },
  checked: { type: "boolean" },
  createdAt: { type: "date", sortable: true },
});

const cartItemRepository = new Repository(cartItemSchema, redisClient);

export default cartItemRepository;
