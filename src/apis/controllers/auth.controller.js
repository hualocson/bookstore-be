import controllerWrapper from "@/lib/controller.wrapper";

const authController = {
  login: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      return successResponse({}, "Login success");
    }
  ),
};

export default authController;
