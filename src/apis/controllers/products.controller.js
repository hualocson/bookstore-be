import controllerWrapper from "@/lib/controller.wrapper";

const productsController = {
  getProducts: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const products = await sql`
      SELECT
        p.id,
        category_id,
        p.name,
        p.slug,
        p.description,
        p.image,
        p.price,
        p.quantity,
        p.status,
        p.deleted_at,
        c.name AS category_name,
        pd.author
      FROM
        products p
      LEFT JOIN product_details pd ON p.id = pd.id
      LEFT JOIN categories c ON
        p.category_id = c.id
      WHERE
        p.deleted_at IS NULL
      ORDER BY p.created_at
      `;

      return successResponse({ products }, "Products retrieved successfully");
    }
  ),

  getProductDetails: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { slug } = req.params;

      const [product] = await sql`
      SELECT
        p.id,
        category_id,
        p.name,
        p.slug,
        p.description,
        p.image,
        p.price,
        p.quantity,
        p.status,
        p.deleted_at,
        c.name AS category_name,
        pd.author,
        pd.publisher,
        pd.publication_date,
        pd.pages,
        e.enum_name AS status_name
      FROM
        products p
      LEFT JOIN product_details pd ON p.id = pd.id
      LEFT JOIN categories c ON
        p.category_id = c.id
      LEFT JOIN enums e ON p.status = e.id
      WHERE
        p.slug = ${slug} AND p.deleted_at IS NULL
    `;
      if (!product) {
        return errorResponse("Product not found", 404);
      }

      return successResponse({ product }, "Product retrieved successfully");
    }
  ),
};

export default productsController;
