import { EntityId } from "redis-om";
import cartItemRepository from "./cart.repository";

/**
 * @description save cart to redis use to add new item to cart (one time if item exists, update other data of item)
 * @param {Object} props
 * @param {number} props.userId
 * @param {number} props.productId
 * @param {number} props.price
 * @param {boolean} props.checked
 * @param {number} [props.quantity=1]
 * @returns {Promise<import('./type.d.ts').CartItem?>}
 */
const saveCart = async ({
  userId,
  productId,
  price,
  checked,
  quantity = 1,
}) => {
  try {
    // check cart exists
    const foundCartItem = await searchCartItem(userId, productId);

    let savedCart;

    if (foundCartItem) {
      const entityId = foundCartItem[EntityId];
      savedCart = await cartItemRepository.save(entityId, {
        userId,
        productId,
        quantity,
        price,
        checked,
      });
    } else {
      savedCart = await cartItemRepository.save({
        userId,
        productId,
        quantity,
        price,
        checked,
      });
    }

    return savedCart;
  } catch (error) {
    console.log("[Error] saveCart ->", error);
  }
};

/**
 * @description search cart by userId return a list of cart item
 * @param {number} userId
 * @param {import('./type.d.ts').SearchOptions} [options={}]
 * @returns {Promise<import('./type.d.ts').CartItem[]>}
 */
const searchCart = async (userId, options = {}) => {
  try {
    const foundCart = await cartItemRepository
      .search()
      .where("userId")
      .equals(userId)
      .return.all();

    if (options.checked) {
      return foundCart.filter((cartItem) => cartItem.checked);
    }

    return foundCart;
  } catch (error) {
    console.log("[Error] searchCart ->", error);
    return [];
  }
};

/**
 * @description search cart item by userId and productId return item in cart or undefined if not found
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<import('./type.d.ts').CartItem?>}
 */
const searchCartItem = async (userId, productId) => {
  try {
    const foundCartItem = await cartItemRepository
      .search()
      .where("userId")
      .equals(parseInt(userId))
      .where("productId")
      .equals(parseInt(productId))
      .return.first();

    return foundCartItem;
  } catch (error) {
    console.log("[Error] searchCartItem ->", error);
  }
};

/**
 * @description update quantity of cart item by userId and productId return updated item or undefined if not found
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity
 * @returns {Promise<import('./type.d.ts').CartItem?>}
 */
const updateQuantityCartItem = async (userId, productId, quantity) => {
  try {
    const foundCartItem = await searchCartItem(userId, productId);

    if (!foundCartItem) {
      return null;
    }

    foundCartItem.quantity = quantity;

    const updatedCartItem = await cartItemRepository.save(foundCartItem);

    return updatedCartItem;
  } catch (error) {
    console.log("[Error] updateCartItem ->", error);
  }
};

/**
 * @description toggle checked of cart item by userId and productId return updated item or undefined if not found
 * @param {number} userId buyer id
 * @param {number} productId
 * @returns {Promise<import('./type.d.ts').CartItem?>}
 */

const toggleCheckedCartItem = async (userId, productId) => {
  try {
    const foundCartItem = await searchCartItem(userId, productId);

    if (!foundCartItem) {
      return null;
    }

    foundCartItem.checked = !foundCartItem.checked;

    const updatedCartItem = await cartItemRepository.save(foundCartItem);

    return updatedCartItem;
  } catch (error) {
    console.log("[Error] updateCheckedCartItem ->", error);
  }
};

const clearCart = async (userId) => {
  try {
    const foundCart = await searchCart(userId, { checked: true });

    if (!foundCart.length) {
      return false;
    }

    // remove cart items array from redis
    const cartItemIds = foundCart.map((cartItem) => cartItem[EntityId]);
    await cartItemRepository.remove(cartItemIds);

    return true;
  } catch (error) {
    console.log("[Error] clearCart ->", error);
    return false;
  }
};

export {
  saveCart,
  searchCart,
  searchCartItem,
  updateQuantityCartItem,
  toggleCheckedCartItem,
  clearCart,
};
