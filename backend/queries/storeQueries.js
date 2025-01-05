const pool = require("../db");

const getMyStores = async (ownerId) => {
  const query = `
    SELECT base_store.*,
           json_agg(DISTINCT base_productcategory.name) AS category,
           COALESCE(
               json_agg(DISTINCT jsonb_build_object(
                   'id', base_stock.id,
                   'number', base_stock.number,
                   'storeName', base_store.name,
                   'store', base_store.id,
                   'product', jsonb_build_object(
                       'id', base_product.id,
                       'name', base_product.name,
                       'price', base_product.price,
                       'category', product_category.name,
                       'brand', base_product.brand
                   )
               ))
               FILTER (WHERE base_stock.id IS NOT NULL),
               '[]'
           ) AS stocks
    FROM base_store
    LEFT JOIN base_store_category ON base_store.id = base_store_category.store_id
    LEFT JOIN base_productcategory ON base_store_category.productcategory_id = base_productcategory.id
    LEFT JOIN base_stock ON base_store.id = base_stock.store_id
    LEFT JOIN base_product ON base_stock.product_id = base_product.id
    LEFT JOIN base_productcategory AS product_category ON base_product.category_id = product_category.id
    WHERE base_store.owner_id = $1
    GROUP BY base_store.id;
  `;
  const result = await pool.query(query, [ownerId]);
  return result.rows;
};

const getAllStores = async () => {
  const query = `
    SELECT base_store.*,
      auth_user.username AS owner_name
    FROM base_store
    LEFT JOIN auth_user ON base_store.owner_id = auth_user.id
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getStoreByUserId = async (user_id) => {
  const query = `
    SELECT base_store.*,
      auth_user.username AS owner_name
    FROM base_store
    LEFT JOIN auth_user ON base_store.owner_id = auth_user.id
    WHERE auth_user.id = $1
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

module.exports = { getMyStores, getAllStores, getStoreByUserId };
