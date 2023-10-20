import controllerWrapper from "@/lib/controller.wrapper";

const customerDetailsController = {
  getCustomerDetail: controllerWrapper(
    async (req, res, { errorResponse, successResponse, sql }) => {
      const { id } = req.user;
      const customerDetail = await sql`
            SELECT first_name, last_name, phone_number
            FROM customer_details
            WHERE id = ${id} AND deleted_at IS NULL
        `;

      return successResponse(
        { customerDetail },
        "Get customer details successfully",
        200
      );
    }
  ),

  createCustomerDetail: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { firstName, lastName, phoneNumber } = req.body;
      const { id } = req.user;

      const [existingCustomerDetail] = await sql`
              SELECT id FROM customer_details WHERE id = ${id}
            `;

      if (existingCustomerDetail) {
        return errorResponse("Details is exited", 400);
      }

      const [newDetail] = await sql`
              INSERT INTO customer_details
                (id, first_name, last_name, phone_number)
              VALUES
                (${id}, ${firstName}, ${lastName}, ${phoneNumber})
              RETURNING id, first_name, last_name, phone_number
            `;

      return successResponse(
        { newDetail },
        "Create new customer details successfully",
        201
      );
    }
  ),

  updateCustomerDetail: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { firstName, lastName, phoneNumber } = req.body;
      const { id } = req.user;

      const [existingCustomerDetail] = await sql`
              SELECT id FROM customer_details WHERE id = ${id}
            `;

      if (!existingCustomerDetail) {
        return errorResponse("Details does not exist", 400);
      }

      const [detail] = await sql`
              UPDATE customer_details
              SET first_name = ${firstName}, last_name = ${lastName}, phone_number = ${phoneNumber}
              WHERE id = ${id}
              RETURNING id, first_name, last_name, phone_number
            `;

      if (!detail) {
        return errorResponse(`Detail with id ${id} not found`, 404);
      }

      return successResponse({ detail }, "Upload detail successfully", 200);
    }
  ),
};

export default customerDetailsController;
