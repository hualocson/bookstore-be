import { groupByKey } from "@/lib/common-func";
import controllerWrapper from "@/lib/controller.wrapper";
const categoriesController = {
  getCategories: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const categories =
        await sql`SELECT id, parent_id, name, slug FROM categories`;

      const groupByParent = groupByKey(categories, "parentId");

      const categoriesWithChildren = groupByParent
        .find((item) => item.parentId === null)
        .data.map((item) => {
          const children = groupByParent.find(
            (child) => child.parentId === item.id
          );
          return {
            id: item.id,
            name: item.name,
            slug: item.slug,
            children: children ? children.data : [],
          };
        });

      return successResponse(
        { categories: categoriesWithChildren },
        "Categories retrieved successfully"
      );
    }
  ),
};

export default categoriesController;
