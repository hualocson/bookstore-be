import { Entity } from "redis-om";
export declare type User = Entity & {
  id: string;
  email: string;
  status: string;
};
