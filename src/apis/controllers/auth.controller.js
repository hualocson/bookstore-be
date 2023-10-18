import controllerWrapper from "@/lib/controller.wrapper";
import { sendTokenEmail } from "@/lib/utils/auth";
import { userServices } from "@/redis-om/user";
import { validationResult } from "express-validator";
import passport from "passport";

const authController = {
  login: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { email } = req.body;

      const [emailExisting] =
        await sql`SELECT id FROM customers WHERE email = ${email}`;
      if (!emailExisting) {
        return errorResponse("Email does not exist. Please signup.", 400);
      }

      // send token
      await sendTokenEmail(email);
      return successResponse({}, "Email sent. Please check your email.");
    }
  ),

  // endpoint: /auth/signup
  signup: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { email } = req.body;
      // check if user already exists
      const [user] = await sql`SELECT id FROM customers WHERE email = ${email}`;

      if (user) {
        return errorResponse("User already exists", 400);
      }

      // send token
      await sendTokenEmail(email);
      return successResponse({}, "Please check your email", 201);
    }
  ),

  // endpoint: /auth/verify-email
  verifyEmail: async (req, res, next) => {
    const validation = validationResult(req);

    if (validation.errors.length > 0) {
      return res.status(422).json({
        success: false,
        error: {
          message: `Validation error: ${validation.errors[0].msg}`,
        },
      });
    }

    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            message: "User not found",
          },
        });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
        });
        return res.status(200).json({
          success: true,
          data: {
            message: "Login success",
          },
        });
      });
    })(req, res, next);
  },

  // endpoint: /auth/google/callback
  googleCallback: async (req, res, next) => {
    passport.authenticate("google", (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            message: "User not found",
          },
        });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
        });
        return res.status(200).json({
          success: true,
          data: {
            message: "Login success",
          },
        });
      });
    })(req, res, next);
  },

  logout: async (req, res, next) => {
    // check user is already logged out
    if (!req.user) {
      return res.status(400).json({
        success: false,
        error: {
          message: "User is not logged in",
        },
      });
    }

    const { id } = req.user;

    req.logout(async (err) => {
      if (err) {
        return next(err);
      }
    });

    const isSuccess = await userServices.removeUser(id);
    if (!isSuccess) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Remove user object form redis failed",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: "Logout success",
      },
    });
  },
};

export default authController;
