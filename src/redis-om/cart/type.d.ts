import { Entity } from "redis-om";

export declare type CartItem = Entity & {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
  checked: boolean;
  createdAt: Date;
};

export declare type SearchOptions = {
  checked?: boolean;
};
