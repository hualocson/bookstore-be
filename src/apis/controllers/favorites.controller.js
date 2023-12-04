import redisClient from "@/configs/redis";
import controllerWrapper from "@/lib/controller.wrapper";
const favoritesController = {
  addToFavorites: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { productId } = req.body;
      const userId = req.user.id;

      // check if product is already in favorites
      const [favoriteExist] = await sql`
        SELECT id FROM favorites WHERE user_id = ${userId} AND product_id = ${productId}
      `;

      if (favoriteExist) {
        return errorResponse("Product is already in favorites", 400);
      }

      const [favorite] =
        await sql`INSERT INTO favorites (user_id, product_id) VALUES (${userId}, ${productId}) RETURNING *`;

      const favoritesLength = await redisClient.get(`favorites:${userId}`);
      if (favoritesLength) {
        await redisClient.set(
          `favorites:${userId}`,
          parseInt(favoritesLength) + 1
        );
      } else {
        await redisClient.set(`favorites:${userId}`, 1);
      }
      return successResponse({ favorite }, "Add to favorites successfully");
    }
  ),

  getFavorites: controllerWrapper(
    async (req, res, { successResponse, sql }) => {
      const userId = req.user.id;
      const favorites =
        await sql`SELECT f.id, f.product_id, p.slug, p.name, p.price, p.image, pd.author
        FROM favorites f
        LEFT JOIN products p ON p.id = f.product_id
        LEFT JOIN product_details pd ON pd.id = p.id
        WHERE user_id = ${userId}`;
      return successResponse({ favorites }, "Get favorites successfully");
    }
  ),

  getFavoritesLength: controllerWrapper(
    async (req, res, { successResponse, sql }) => {
      const userId = req.user.id;
      const favoritesLength = await redisClient.get(`favorites:${userId}`);
      return successResponse(
        { favoritesLength: parseInt(favoritesLength) },
        "Get favorites length successfully"
      );
    }
  ),

  deleteFavorite: controllerWrapper(
    async (req, res, { successResponse, sql }) => {
      const { id } = req.params;
      const userId = req.user.id;
      const [favorite] =
        await sql`DELETE FROM favorites WHERE product_id = ${id} AND user_id = ${userId} RETURNING *`;

      const favoritesLength = await redisClient.get(`favorites:${userId}`);
      if (favoritesLength && parseInt(favoritesLength) > 0) {
        await redisClient.set(
          `favorites:${userId}`,
          parseInt(favoritesLength) - 1
        );
      } else {
        await redisClient.set(`favorites:${userId}`, 0);
      }
      return successResponse({ favorite }, "Delete favorite successfully");
    }
  ),
};

export default favoritesController;
