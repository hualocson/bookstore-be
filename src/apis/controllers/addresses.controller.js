import controllerWrapper from "@/lib/controller.wrapper";

const addressesController = {
  getAddresses: controllerWrapper(
    async (req, res, { errorResponse, successResponse, sql }) => {
      const { id } = req.user;
      const addresses = await sql`
            SELECT id, name, street_address, city, state, postal_code, country, phone_number
            FROM addresses
            WHERE customer_id = ${id} AND deleted_at IS NULL
            ORDER BY created_at DESC
        `;

      return successResponse(
        { addresses },
        "Get all customer addresses successfully",
        200
      );
    }
  ),

  createAddresses: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const {
        name,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
      } = req.body;
      const { id } = req.user;

      const [newAddress] = await sql`
              INSERT INTO addresses
                (customer_id, name, street_address, city, state, postal_code, country, phone_number)
              VALUES
                (${id}, ${name}, ${streetAddress}, ${city}, ${state}, ${postalCode}, ${country}, ${phoneNumber})
              RETURNING customer_id, street_address, city, postal_code, country, phone_number
            `;

      return successResponse(
        { newAddress },
        "Create new customer address successfully",
        201
      );
    }
  ),

  updateAddresses: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const {
        name,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
      } = req.body;
      const { id } = req.user;
      const { addressId } = req.params;

      const [existingCustomerAddress] = await sql`
              SELECT customer_id FROM addresses WHERE id = ${addressId} AND customer_id = ${id}
            `;

      if (!existingCustomerAddress) {
        return errorResponse("Address does not exist", 404);
      }

      const [address] = await sql`
              UPDATE addresses
              SET name = ${name}, street_address = ${streetAddress}, city = ${city}, state = ${state}, postal_code = ${postalCode}, country = ${country}, phone_number = ${phoneNumber}
              WHERE id = ${addressId} AND customer_id = ${id}
              RETURNING id, customer_id, street_address, city, state, postal_code, country, phone_number
            `;

      if (!address) {
        return errorResponse(`Address with id ${addressId} not found`, 404);
      }

      return successResponse({ address }, "Upload address successfully", 200);
    }
  ),

  deleteAddress: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { id } = req.user;
      const { addressId } = req.params;

      const [existingAddress] = await sql`
            SELECT deleted_at FROM addresses WHERE id = ${addressId} AND customer_id = ${id}
          `;

      if (!existingAddress) {
        return errorResponse(`Address with id ${addressId} not found`, 404);
      }

      if (existingAddress.deletedAt !== null) {
        return errorResponse(`Address with id ${addressId} is deleted`, 404);
      }
      const [address] = await sql`
          UPDATE addresses
          SET deleted_at = NOW()
          WHERE id = ${addressId} AND customer_id = ${id}
          RETURNING id, customer_id, street_address, city, state, postal_code, country, phone_number
          `;

      return successResponse({ address }, "Address deleted successfully", 200);
    }
  ),
};

export default addressesController;
