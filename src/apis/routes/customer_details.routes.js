import { body } from "express-validator";
import customerDetailsController from "../controllers/customer_details.controller";
import isAuth from "../middlewares/isAuth";

const customerDetailRoutes = (router) => {
  router.get("/profile", isAuth, customerDetailsController.getCustomerDetail);

  router.post(
    "/profile",
    isAuth,
    body("firstName")
      .notEmpty()
      .withMessage("firstName is required")
      .isString()
      .withMessage("firstName must be a string"),
    body("lastName")
      .notEmpty()
      .withMessage("lastName is required")
      .isString()
      .withMessage("lastName must be a string"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("phoneNumber is required")
      .isString()
      .withMessage("phoneNumber must be a string"),
    customerDetailsController.createCustomerDetail
  );

  router.patch(
    "/profile",
    isAuth,
    body("firstName")
      .notEmpty()
      .withMessage("firstName is required")
      .isString()
      .withMessage("firstName must be a string"),
    body("lastName")
      .notEmpty()
      .withMessage("lastName is required")
      .isString()
      .withMessage("lastName must be a string"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("phoneNumber is required")
      .isString()
      .withMessage("phoneNumber must be a string"),
    customerDetailsController.updateCustomerDetail
  );
};

export default customerDetailRoutes;
