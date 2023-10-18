import { Schema, Repository } from "redis-om";
import redisClient from "@/configs/redis";

const userSchema = new Schema("user", {
  id: { type: "number" },
  email: { type: "string" },
  status: { type: "number" },
});

const userRepository = new Repository(userSchema, redisClient);

export default userRepository;
