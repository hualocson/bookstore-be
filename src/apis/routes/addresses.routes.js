import { body, param } from "express-validator";
import addressesController from "../controllers/addresses.controller";
import isAuth from "../middlwares/isAuth";

const addressesRoutes = (router) => {
    router.get(
      "/addresses",
      addressesController.getAddressesById
    );

    router.post(
        "/addresses",
        isAuth,
        body("streetAddress")
          .notEmpty()
          .withMessage("streetAddress is required")
          .isString()
          .withMessage("streetAddress must be a string"),
        body("city")
          .notEmpty()
          .withMessage("city is required")
          .isString()
          .withMessage("city must be a string"),
        body("state")
          .notEmpty()
          .withMessage("state is required")
          .isString()
          .withMessage("state must be a string"),
        body("postalCode")
          .notEmpty()
          .withMessage("postalCode is required")
          .isString()
          .withMessage("postalCode must be a string"),
        body("country")
          .notEmpty()
          .withMessage("country is required")
          .isString()
          .withMessage("country must be a string"),
        body("phoneNumber")
          .notEmpty()
          .withMessage("phoneNumber is required")
          .isString()
          .withMessage("phoneNumber must be a string"),
        addressesController.createAddresses
      );

    router.patch(
        "/addresses/:addressId",
        isAuth,
        param("addressId").isInt().withMessage("Id must be a number"),
        body("streetAddress")
          .notEmpty()
          .withMessage("streetAddress is required")
          .isString()
          .withMessage("streetAddress must be a string"),
        body("city")
          .notEmpty()
          .withMessage("city is required")
          .isString()
          .withMessage("city must be a string"),
        body("state")
          .notEmpty()
          .withMessage("state is required")
          .isString()
          .withMessage("state must be a string"),
        body("postalCode")
          .notEmpty()
          .withMessage("postalCode is required")
          .isString()
          .withMessage("postalCode must be a string"),
        body("country")
          .notEmpty()
          .withMessage("country is required")
          .isString()
          .withMessage("country must be a string"),
        body("phoneNumber")
          .notEmpty()
          .withMessage("phoneNumber is required")
          .isString()
          .withMessage("phoneNumber must be a string"),
        addressesController.updateAddresses
    );

    router.patch(
        "/addresses/:addressId/delete",
        isAuth,
        param("addressId").isInt().withMessage("Id must be a number"),
        addressesController.deleteAddress
    );
};
  
  export default addressesRoutes;