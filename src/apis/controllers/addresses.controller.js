import { controllerWrapper } from "@/lib/controller.wrapper";

const addressesController = {
    getAddressesById: controllerWrapper(
        async (_, res, { errorResponse, successResponse, sql }) => {
        const { customer_id } = req.params;
        const addresses = await sql`
            SELECT street_address, city, state, postal_code, country, phone_number
            FROM addresses
            WHERE customer_id = ${customer_id} AND deleted_at IS NULL
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
            const { street_address, city, state, postal_code, country, phone_number } = req.body;
            const { customer_id } = req.params;
            
            const [newAddress] = await sql`
              INSERT INTO addresses
                (customer_id, street_address, city, state, postal_code, country, phone_number)
              VALUES
                (${customer_id}, ${street_address ?? ""}, ${city}, ${
                    state ?? ""
                }, ${postal_code ?? ""}, ${country ?? ""}, ${phone_number ?? ""})
              RETURNING customer_id, street_address, city, postal_code, country, phone_number
            `;
      
            return successResponse(
              { newAddress },
              "Create new customer address successfully",
              200
            );
          }
    ),

    updateAddresses: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
            const { street_address, city, state, postal_code, country, phone_number } = req.body;
            const {customer_id} = req.params.customer_id;
            const { id } = req.params.id;
      
            // check if category with name existed
            const [existingCustomerAddress] = await sql`
              SELECT customer_id FROM addresses WHERE id = ${id} AND customer_id = ${customer_id}
            `;
      
            if (!existingCustomerAddress) {
              return errorResponse("Address does not existed", 400);
            }
      
            const [address] = await sql`
              UPDATE addresses
              SET street_address = ${street_address ?? ""}, city = ${city ?? ""}, state = ${
                state ?? ""
              }, postal_code = ${postal_code ?? ""}, country = ${country ?? ""}, phone_number = ${phone_number ?? ""}
              WHERE id = ${id} AND customer_id = ${customer_id}
              RETURNING id, customer_id, street_address, city, state, postal_code, country, phone_number
            `;
      
            if (!address) {
              return errorResponse(`Address with id ${id} not found`, 404);
            }
      
            return successResponse(
              { address },
              "Upload address successfully",
              200
            );
          }
    ),

    deleteAddress: controllerWrapper(
        async (req, _, { errorResponse, successResponse, sql }) => {
          const { id } = req.params.id;
          const { customer_id } = req.params.customer_id;
    
          const [existingAdress] = await sql`
            SELECT id, customer_id, deleted_at FROM addresses WHERE id = ${id} && customer_id = ${customer_id}
          `;
    
          if (!existingAdress) {
            return errorResponse(`Address with id ${id} not found`, 404);
          }
    
          if (existingAdress.deleted_at !== null) {
            return errorResponse(`Address with id ${id} is deleted`, 404);
          }
          const [address] = await sql`
          UPDATE addresses
          SET deleted_at = NOW()
          WHERE id = ${id} AND customer_id = ${customer_id}
          RETURNING id, customer_id, street_address, city, state, postal_code, country, phone_number
          `;

          return successResponse(
            { address },
            "Product deleted successfully",
            200
          );
        }
      ),
};
  
export default addressesController;
