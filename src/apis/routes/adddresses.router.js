import { body, param } from "express-validator";
import addressesController from "../controllers/addresses.controller";
import {isAuth} from "../middlwares/isAuth"
/**
 *
 * @param {import('express').Router} router
 */

const addressesRoutes = (router) => {
    router.get(
      "/addresses/:customer_id",
      addressesController.getAddressesById
    );

    router.post(
        "/addresses/:customer_id",
        param("customer_id").isInt().withMessage("customer_id must be a number"),
        body("street_address")
          .notEmpty()
          .withMessage("street_address is required")
          .isString()
          .withMessage("street_address must be a string"),
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
        body("postal_code")
          .notEmpty()
          .withMessage("postal_code is required")
          .isString()
          .withMessage("postal_code must be a string"),
        body("country")
          .notEmpty()
          .withMessage("country is required")
          .isString()
          .withMessage("country must be a string"),
        body("phone_number")
          .notEmpty()
          .withMessage("phone_number is required")
          .isString()
          .withMessage("phone_number must be a string"),
        addressesController.createAddresses
      );

    router.patch(
        "/addresses/:customer_id/:id",
        param("customer_id").isInt().withMessage("customer_id must be a number"),
        param("id").isInt().withMessage("Id must be a number"),
        body("street_address")
          .notEmpty()
          .withMessage("street_address is required")
          .isString()
          .withMessage("street_address must be a string"),
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
        body("postal_code")
          .notEmpty()
          .withMessage("postal_code is required")
          .isString()
          .withMessage("postal_code must be a string"),
        body("country")
          .notEmpty()
          .withMessage("country is required")
          .isString()
          .withMessage("country must be a string"),
        body("phone_number")
          .notEmpty()
          .withMessage("phone_number is required")
          .isString()
          .withMessage("phone_number must be a string"),
        addressesController.updateAddresses
    );

    router.patch(
        "/addresses/:customer_id/:id/delete",
        param("customer_id").isInt().withMessage("customer_id must be a number"),
        param("id").isInt().withMessage("Id must be a number"),
        body("street_address")
          .notEmpty()
          .withMessage("street_address is required")
          .isString()
          .withMessage("street_address must be a string"),
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
        body("postal_code")
          .notEmpty()
          .withMessage("postal_code is required")
          .isString()
          .withMessage("postal_code must be a string"),
        body("country")
          .notEmpty()
          .withMessage("country is required")
          .isString()
          .withMessage("country must be a string"),
        body("phone_number")
          .notEmpty()
          .withMessage("phone_number is required")
          .isString()
          .withMessage("phone_number must be a string"),
        addressesController.deleteAddress
    );
};
  
  export default addressesRoutes;