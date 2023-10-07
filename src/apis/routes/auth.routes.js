import authController from "../controllers/auth.controller";

const authRoutes = (router) => {
  router.post("/auth/login", authController.login);
};

export default authRoutes;
