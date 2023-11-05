import controllerWrapper from "@/lib/controller.wrapper";
const customersController = {
  getCustomerInfo: controllerWrapper(
    async (req, res, { successResponse, errorResponse, sql }) => {
      const { id } = req.user;

      const [customer] = await sql`
        SELECT
          c.email,
          c.status,
          cd.first_name,
          cd.last_name,
          cd.phone_number
        FROM customers c
        LEFT JOIN customer_details cd ON cd.id = c.id
        WHERE c.id = ${id} AND c.deleted_at IS NULL
      `;

      if (!customer) {
        return errorResponse({
          message: "Customer not found",
          statusCode: 404,
        });
      }

      return successResponse(
        {
          customer,
        },
        "Customer info retrieved successfully"
      );
    }
  ),
};

export default customersController;
