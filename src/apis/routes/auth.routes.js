import { body } from "express-validator";
import authController from "../controllers/auth.controller";
import { emailValidationChain } from "@/lib/utils/validations";

const authRoutes = (router) => {
  router.post("/auth/login", emailValidationChain(), authController.login);

  router.post("/auth/signup", emailValidationChain(), authController.signup);

  router.post(
    "/auth/verify-email",
    emailValidationChain(),
    body("token")
      .notEmpty()
      .withMessage("Token is required")
      .isInt()
      .withMessage("Token must be a number"),
    authController.verifyEmail
  );
};

export default authRoutes;
