import { Schema, Repository } from "redis-om";
import redisClient from "@/configs/redis";

const cartItemSchema = new Schema("cartItem", {
  userId: { type: "number" },
  productId: { type: "number" },
  quantity: { type: "number" },
  price: { type: "number" },
  checked: { type: "boolean" },
});

const cartItemRepository = new Repository(cartItemSchema, redisClient);

export default cartItemRepository;
