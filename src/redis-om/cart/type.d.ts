import { Entity } from "redis-om";
/**
 * CartItem
 * @property {string} userId - user id
 * @property {string} productId - product id
 * @property {number} quantity - quantity
 * @property {number} price - price of 1 item
 */
export declare type CartItem = Entity & {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
  checked: boolean;
};
