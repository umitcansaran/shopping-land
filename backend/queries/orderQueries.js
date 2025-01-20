
const pool = require("../db");

const getMyOrders = async (user_id) => {
  const query = `
    SELECT * 
    FROM base_order
    WHERE customer_id = $1
    ORDER BY "createdAt" DESC
        `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

const getOrder = async (id) => {
  const query = `
    SELECT 
    base_order.*,
    json_agg(DISTINCT jsonb_build_object(
        'id', base_sellerorder.id,
        'seller', jsonb_build_object(
            'id', auth_user.id,
            'username', auth_user.username,
            'name', auth_user.email,
            'email', auth_user.email,
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
        'order', jsonb_build_object(
            'id', base_order.id, 
            'isPaid', base_order."isPaid",
            'paidAt', base_order."paidAt"
        ),
        'onlineOrderItems', COALESCE((
            SELECT json_agg(jsonb_build_object(
                'id', base_onlineorderitem.id,
                'name', base_onlineorderitem.name,
                'quantity', base_onlineorderitem.quantity,
                'price', base_onlineorderitem.price,
                'image', base_onlineorderitem.image,
                'orderType', base_onlineorderitem."orderType",
                'sellerOrder', base_onlineorderitem."sellerOrder_id",
                'product', base_onlineorderitem.product_id
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
                )
            ))
            FROM base_instoreorderitem
            WHERE base_instoreorderitem."sellerOrder_id" = base_sellerorder.id
        ), '[]'::json),
        'shippingAddress', (
            SELECT json_agg(jsonb_build_object(
                'id', base_shippingaddress.id, 
                'address', base_shippingaddress.address, 
                'city', base_shippingaddress.city, 
                'postalCode', base_shippingaddress."postalCode", 
                'country', base_shippingaddress.country, 
                'order_id', base_shippingaddress.order_id
            ))
            FROM base_shippingaddress
            WHERE base_shippingaddress.order_id = base_order.id
        ),
        'createdAt', base_sellerorder."createdAt",
        'shippingPrice', base_sellerorder."shippingPrice",
        'isShipped', base_sellerorder."isShipped",
        'shippedAt', base_sellerorder."shippedAt",
        'totalPrice', base_sellerorder."totalPrice",
        'customer_id', base_sellerorder.customer_id,
        'order_id', base_sellerorder.order_id,
        'seller_id', base_sellerorder.seller_id,
        'completedAt', base_sellerorder."completedAt",
        'isCompleted', base_sellerorder."isCompleted"
    )) AS "sellerOrder",
    jsonb_build_object(
        'id', customer.id, 
        'username', customer.username, 
        'email', customer.email, 
        'name', customer.email
    ) AS "customer",
    jsonb_build_object(
        'id', base_shippingaddress.id, 
        'address', base_shippingaddress.address, 
        'city', base_shippingaddress.city, 
        'postalCode', base_shippingaddress."postalCode", 
        'country', base_shippingaddress.country, 
        'order_id', base_shippingaddress.order_id
    ) AS "shippingAddress"
FROM 
    base_order
LEFT JOIN 
    base_sellerorder ON base_order.id = base_sellerorder.order_id
LEFT JOIN 
    auth_user ON auth_user.id = base_sellerorder.seller_id
LEFT JOIN 
    base_profile ON base_profile.user_id = auth_user.id
LEFT JOIN 
    auth_user AS customer ON customer.id = base_sellerorder.customer_id
LEFT JOIN 
    base_shippingaddress ON base_shippingaddress.order_id = base_order.id
LEFT JOIN 
    base_instoreorderitem ON base_instoreorderitem."sellerOrder_id" = base_sellerorder.id
LEFT JOIN 
    base_store ON base_store.id = base_instoreorderitem.store_id
LEFT JOIN 
    auth_user AS store_owner ON store_owner.id = base_store.owner_id
WHERE 
    base_order.id = $1
GROUP BY 
    base_order.id, customer.id, base_shippingaddress.id;

          `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  getMyOrders, getOrder
};