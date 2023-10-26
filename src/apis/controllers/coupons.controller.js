import { CouponStatus } from "@/lib/constants";
import controllerWrapper from "@/lib/controller.wrapper";

const couponsController = {
    getAllCoupons: controllerWrapper(
        //Get các thuộc tinh của coupon: id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status
        async (req, res, { errorResponse, successResponse, sql }) => {
            const coupons = await sql`
                SELECT id, coupon_code, coupon_type, coupon_value, coupon_start_date, coupon_end_date, coupon_min_spend, coupon_max_spend, coupon_uses_per_customer, coupon_uses_per_coupon, coupon_status
                FROM coupons
                WHERE deleted_at IS NULL and coupon_status != ${CouponStatus.DISABLED}
            `;
            return successResponse(
                { coupons },
                "Get all coupons successfully",
                200
            );
        }
    ),
}

export default couponsController;