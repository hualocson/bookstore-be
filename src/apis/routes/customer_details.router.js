import { body, param } from "express-validator";
import customerDetailsController from "../controllers/customer_details.controller";
import isAuth from "../middlwares/isAuth";

const customerDetailRoutes = (router) => {
    router.get(
      "/detail",
      customerDetailsController.getCustomerDetail
    );

    router.post(
        "/detail",
        isAuth,
        body("first_name")
          .notEmpty()
          .withMessage("first_name is required")
          .isString()
          .withMessage("first_name must be a string"),
        body("last_name")
          .notEmpty()
          .withMessage("last_name is required")
          .isString()
          .withMessage("last_name must be a string"),
        body("phone_number")
          .notEmpty()
          .withMessage("phone_number is required")
          .isString()
          .withMessage("phone_number must be a string"),
        customerDetailsController.createCustomerDetail
      );

    router.patch(
        "/detail",
        isAuth,
        body("first_name")
          .notEmpty()
          .withMessage("first_name is required")
          .isString()
          .withMessage("first_name must be a string"),
        body("last_name")
          .notEmpty()
          .withMessage("last_name is required")
          .isString()
          .withMessage("last_name must be a string"),
        body("phone_number")
          .notEmpty()
          .withMessage("phone_number is required")
          .isString()
          .withMessage("phone_number must be a string"),
        customerDetailsController.updateCustomerDetail
    );
};
  
  export default customerDetailRoutes;