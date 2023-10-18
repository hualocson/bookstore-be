import { body } from "express-validator";
import authController from "../controllers/auth.controller";
import { emailValidationChain } from "@/lib/utils/validations";
import passport from "passport";

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

  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get("/auth/google/callback", authController.googleCallback);

  router.post("/auth/logout", authController.logout);
};

export default authRoutes;
