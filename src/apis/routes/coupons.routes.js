import { body } from "express-validator";
import couponsController from "../controllers/coupons.controller";
import isAuth from "../middlewares/isAuth";

const couponsRoutes = (router) => {
    router.get("/coupons", couponsController.getAllCoupons);
};
export default couponsRoutes;