import { userRepository } from "../user";
import { cartItemRepository } from "../cart";

const createIndex = async () => {
  await userRepository.createIndex();
  await cartItemRepository.createIndex();
};

export { createIndex };
