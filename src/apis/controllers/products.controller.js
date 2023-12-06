import controllerWrapper from "@/lib/controller.wrapper";

const productsController = {
  getProducts: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { search } = req.query;

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
        p.deleted_at IS NULL ${
          search && search !== ""
            ? sql`AND p.name ILIKE ${`%${search}%`}`
            : sql``
        }
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

      // get list product in the same category
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
        c.name AS category_name,
        c.slug as category_slug,
        pd.author
      FROM
        products p
      LEFT JOIN product_details pd ON p.id = pd.id
      LEFT JOIN categories c ON
        p.category_id = c.id
      WHERE
        p.deleted_at IS NULL AND p.category_id = ${product.categoryId} AND p.id != ${product.id}
      `;

      return successResponse(
        { product, relateProducts: products },
        "Product retrieved successfully"
      );
    }
  ),

  getProductByCategory: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { slug } = req.params;

      const categories = await sql`
      WITH RECURSIVE CategoryHierarchy AS (
        SELECT id, parent_id, slug
        FROM categories
        WHERE slug = ${slug}

        UNION ALL

        SELECT c.id, c.parent_id, c.slug
        FROM categories c
        JOIN CategoryHierarchy ch ON c.parent_id = ch.id
        )
        SELECT * FROM CategoryHierarchy;
      `;

      // const categories = [category.id, category.parentId];

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
            p.deleted_at IS NULL AND p.category_id IN ${sql(
              categories.map((c) => c.id)
            )}
          ORDER BY p.created_at
    `;
      return successResponse({ products }, "Products retrieved successfully");
    }
  ),
};

export default productsController;
