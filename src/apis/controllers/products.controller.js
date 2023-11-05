import controllerWrapper from "@/lib/controller.wrapper";

const productsController = {
  getProducts: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const products = await sql`SELECT * FROM products`;

      return successResponse({ products }, "Products retrieved successfully");
    }
  ),
};

export default productsController;
