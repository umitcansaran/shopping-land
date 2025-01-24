const pool = require("../db");

const getMySellerOrders = async (user_id) => {
  const query = `
    SELECT 
    base_sellerorder.*,
    COALESCE(
        jsonb_build_object(
        'isPaid', base_order."isPaid", 
        'paidAt', base_order."paidAt"
        ),
        '[]' -- Provide a default value in case no orders are found
    ) AS "order"
    FROM 
    base_sellerorder
    LEFT JOIN 
    base_order ON base_order.id = base_sellerorder.order_id
    WHERE 
    base_sellerorder.seller_id = $1
    GROUP BY 
    base_sellerorder.id, base_order."isPaid", base_order."paidAt";
        `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

const getSellerOrder = async (id) => {
  const query = `
    SELECT 
    jsonb_build_object(
        'id', base_sellerorder.id,
        'seller', jsonb_build_object(
            'id', auth_user.id,
            'name', auth_user.email,
            'profile', jsonb_build_object(
                'id', base_profile.id,
                'name', auth_user.username,
                'status', base_profile.status,
                'industry', base_profile.industry,
                'headquarter', base_profile.headquarter,
                'image', base_profile.image,
                'description', base_profile.description,
                'user', auth_user.id
            )
        ),
        'order_id', base_sellerorder.order_id,
        'createdAt', base_sellerorder."createdAt",
        'isShipped', base_sellerorder."isShipped",
        'shippedAt', base_sellerorder."shippedAt",
        'totalPrice', base_sellerorder."totalPrice",
        'completedAt', base_sellerorder."completedAt",
        'customer_id', base_sellerorder.customer_id,
        'isCompleted', base_sellerorder."isCompleted",
        'shippingPrice', base_sellerorder."shippingPrice",
        'customer', COALESCE((
            SELECT jsonb_build_object(
                'id', customer.id, 
                'username', customer.username, 
                'email', customer.email, 
                'name', customer.email
            )
            FROM auth_user AS customer
            WHERE customer.id = base_sellerorder.customer_id
        ), '[]'::jsonb),
        'order', jsonb_build_object(
            'id', base_order.id, 
            'isPaid', base_order."isPaid",
            'paidAt', base_order."paidAt"
        ),
        'shippingAddress', COALESCE((
            SELECT jsonb_build_object(
                'id', base_shippingaddress.id, 
                'address', base_shippingaddress.address, 
                'city', base_shippingaddress.city, 
                'postalCode', base_shippingaddress."postalCode", 
                'country', base_shippingaddress.country, 
                'order_id', base_shippingaddress.order_id
            )
            FROM base_shippingaddress
            WHERE base_shippingaddress.order_id = base_order.id
        ), '[]'::jsonb),
        'onlineOrderItems', COALESCE((
            SELECT json_agg(jsonb_build_object(
                'id', base_onlineorderitem.id,
                'name', base_onlineorderitem.name,
                'quantity', base_onlineorderitem.quantity,
                'price', base_onlineorderitem.price,
                'image', base_onlineorderitem.image,
                'orderType', base_onlineorderitem."orderType",
                'sellerOrder', base_onlineorderitem."sellerOrder_id",
                'product', base_onlineorderitem.product_id,
				                'details', (
                    SELECT jsonb_build_object(
                        'id', base_product.id,
                        'brand', base_product.brand,
						'name', base_product.name,
						'price', base_product.price,
						'description', base_product.description,
						'image', base_product.image,
						'seller', base_product.seller_id,
						'category', base_product.category_id,
						'subcategory', base_product.subcategory_id
                    )
                    FROM base_product
                    WHERE base_product.id = base_onlineorderitem.product_id
                )
            ))
            FROM base_onlineorderitem
            WHERE base_onlineorderitem."sellerOrder_id" = base_sellerorder.id
        ), '[]'::json),
        'inStoreOrderItems', COALESCE((
            SELECT json_agg(jsonb_build_object(
                'id', base_instoreorderitem.id,
                'name', base_instoreorderitem.name,
                'quantity', base_instoreorderitem.quantity,
                'price', base_instoreorderitem.price,
                'orderType', base_instoreorderitem."orderType",
                'sellerOrder', base_instoreorderitem."sellerOrder_id",
                'product', base_instoreorderitem.product_id,
                'store', jsonb_build_object(
                    'id', base_store.id,
                    'name', base_store.name,
                    'owner_name', store_owner.username
                ),
                'details', (
                    SELECT jsonb_build_object(
                        'id', base_product.id,
                        'brand', base_product.brand,
						'name', base_product.name,
						'price', base_product.price,
						'description', base_product.description,
						'image', base_product.image,
						'seller', base_product.seller_id,
						'category', base_product.category_id,
						'subcategory', base_product.subcategory_id
                    )
                    FROM base_product
                    WHERE base_product.id = base_instoreorderitem.product_id
                )
            ))
            FROM base_instoreorderitem
            LEFT JOIN base_store ON base_store.id = base_instoreorderitem.store_id
            LEFT JOIN auth_user AS store_owner ON store_owner.id = base_store.owner_id
            WHERE base_instoreorderitem."sellerOrder_id" = base_sellerorder.id
        ), '[]'::json)
    ) AS result
    FROM 
        base_order
    LEFT JOIN 
        base_sellerorder ON base_order.id = base_sellerorder.order_id
    LEFT JOIN 
        auth_user ON auth_user.id = base_sellerorder.seller_id
    LEFT JOIN 
        base_profile ON base_profile.user_id = auth_user.id
    LEFT JOIN 
        base_shippingaddress ON base_shippingaddress.order_id = base_order.id
    WHERE 
        base_sellerorder.id = $1;
          `;
  const result = await pool.query(query, [id]);
  return result.rows[0].result;
};

module.exports = {
  getMySellerOrders,
  getSellerOrder,
};
