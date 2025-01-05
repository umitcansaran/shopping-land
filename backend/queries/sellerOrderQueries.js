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
    SELECT base_sellerorder.*,
       jsonb_build_object('id', auth_user.id, 'username', auth_user.username, 'name', auth_user.email, 'email', auth_user.email, 'profile', jsonb_build_object('id', base_profile.id, 'name', auth_user.username, 'status', base_profile.status, 'industry', base_profile.industry, 'headquarter', base_profile.headquarter, 'image', base_profile.image, 'description', base_profile.description, 'user', auth_user.id)) AS seller,
       jsonb_build_object('id', customer.id, 'username', customer.username, 'email', customer.email, 'name', customer.email) AS customer,
       jsonb_build_object('id', base_order.id, 'isPaid', base_order."isPaid", 'paidAt', base_order."paidAt") AS "order",
       COALESCE(json_agg(DISTINCT jsonb_build_object('id', base_onlineorderitem.id, 'name', base_onlineorderitem.name, 'quantity', base_onlineorderitem.quantity, 'price', base_onlineorderitem.price, 'image', base_onlineorderitem.image, 'orderType', base_onlineorderitem."orderType", 'sellerOrder', base_onlineorderitem."sellerOrder_id", 'product', base_onlineorderitem.product_id)::JSONB) FILTER (
                                                                                                                                                                                                                                                                                                                                                                                                             WHERE base_onlineorderitem.id IS NOT NULL), '[]'::JSON) AS "onlineOrderItems",
       COALESCE(json_agg(DISTINCT jsonb_build_object(
	   'id', base_instoreorderitem.id, 'name', base_instoreorderitem.name, 'quantity', base_instoreorderitem.quantity, 'price', base_instoreorderitem.price, 'image', base_instoreorderitem.image, 'orderType', base_instoreorderitem."orderType", 'isRetrieved', base_instoreorderitem."isRetrieved", 'retrievedAt', base_instoreorderitem."retrievedAt", 'product', base_instoreorderitem.product_id, 'sellerOrder', base_instoreorderitem."sellerOrder_id", 'store', base_instoreorderitem.store_id, 
	   'details', jsonb_build_object(
	   		'id', base_product.id, 'brand', base_product.brand, 'name', base_product.name, 'price', base_product.price, 'description', base_product.description, 'image', base_product.image, 'rating', base_product.rating, 'numReviews', base_product."numReviews", 'createdAt', base_product."createdAt", 'category', base_product."category_id", 'seller', base_product.seller_id, 'subcategory', base_product."subcategory_id"),
	   'store', jsonb_build_object(
		   'id', base_store.id, 
		   'owner_name', store_owner.username, 
		   'name', base_store.name,
		   'address', base_store.address,
		   'country', base_store.country,
		   'city', base_store.city,
		   'latitude', base_store.latitude,
		   'longitude', base_store.longitude,
		   'description', base_store.description,
		   'phone', base_store.phone,
		   'image', base_store.image,
		   'owner', base_store.owner_id	   
	  ))::JSONB) FILTER (WHERE base_instoreorderitem.id IS NOT NULL), '[]'::JSON) AS "inStoreOrderItems",
       COALESCE(jsonb_build_object('id', base_shippingaddress.id, 'address', base_shippingaddress.address, 'city', base_shippingaddress.city, 'postalCode', base_shippingaddress."postalCode", 'country', base_shippingaddress.country, 'order_id', base_shippingaddress.order_id), '{}'::JSONB -- Default to an empty JSON object if no address is found
    ) AS "shippingAddress"
    FROM base_sellerorder
    LEFT JOIN auth_user ON auth_user.id = base_sellerorder.seller_id
    LEFT JOIN base_profile ON base_profile.user_id = auth_user.id
    LEFT JOIN auth_user AS customer ON customer.id = base_sellerorder.customer_id
    LEFT JOIN base_order ON base_order.id = base_sellerorder.order_id
    LEFT JOIN base_onlineorderitem ON base_onlineorderitem."sellerOrder_id" = base_sellerorder.id
    LEFT JOIN base_instoreorderitem ON base_instoreorderitem."sellerOrder_id" = base_sellerorder.id
    LEFT JOIN base_shippingaddress ON base_shippingaddress.order_id = base_order.id
    LEFT JOIN base_product ON base_product.id = base_instoreorderitem.product_id
	LEFT JOIN base_store ON base_store.id = base_instoreorderitem.store_id
	LEFT JOIN (
    SELECT id, username
    FROM auth_user
) AS store_owner ON store_owner.id = base_store.owner_id
    WHERE base_sellerorder.id = $1
    GROUP BY base_sellerorder.id,
            auth_user.id,
            base_profile.id,
            customer.id,
            base_order.id,
            base_shippingaddress.id
          `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; 
  };

module.exports = {
    getMySellerOrders,
    getSellerOrder
};
