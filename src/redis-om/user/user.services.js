import userRepository from "./user.repository";
import { EntityId } from "redis-om";

/**
 *
 * @param {Object} props
 * @param {number} props.id
 * @param {string} props.email
 * @param {string} props.status
 * @returns {Promise<import("./type").User?>}
 */
const saveUser = async ({ id, email, status }) => {
  try {
    // check user exists
    const foundUser = await searchUser(id);

    let savedUser;

    if (foundUser) {
      const entityId = foundUser[EntityId];
      savedUser = await userRepository.save(entityId, { id, email, status });
    } else {
      savedUser = await userRepository.save({ id, email, status });
    }

    return savedUser;
  } catch (error) {
    console.log("[Error] saveUser ->", error);
  }
};

/**
 *
 * @param {number} id
 * @returns {Promise<import("./type").User?>}
 */
const searchUser = async (id) => {
  try {
    const foundUser = await userRepository
      .search()
      .where("id")
      .equals(parseInt(id))
      .return.first();

    return foundUser;
  } catch (error) {
    console.log("[Error] searchUser ->", error);
  }
};

const removeUser = async (id) => {
  try {
    const foundUser = await searchUser(id);

    if (!foundUser) {
      return false;
    }

    await userRepository.remove(foundUser[EntityId]);
    return true;
  } catch (error) {
    console.log("[Error] removeUser ->", error);
    return false;
  }
};

export { searchUser, saveUser, removeUser };
