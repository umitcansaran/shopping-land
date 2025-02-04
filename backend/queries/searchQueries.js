// Query mapping based on 'type'
const queryMapping = {
  all: {
    query: `
        SELECT * 
        FROM base_product 
        LEFT JOIN auth_user ON base_product.seller_id = auth_user.id 
        WHERE LOWER(base_product.brand) LIKE LOWER($1) 
            OR LOWER(base_product.name) LIKE LOWER($1) 
            OR LOWER(auth_user.username) LIKE LOWER($1)
      `,
    params: (req) => [`%${req.query.search_string || ""}%`],
  },
  products_by_seller: {
    query: `
        SELECT *
        FROM base_product
        LEFT JOIN auth_user ON base_product.seller_id = auth_user.id
        WHERE (LOWER(base_product.brand) LIKE LOWER($2)
            OR LOWER(base_product.name) LIKE LOWER($2))
        AND auth_user.id = $1
      `,
    params: (req) => [
      req.query.seller_id,
      `%${req.query.search_string || ""}%`,
    ],
  },
  products: {
    query: `
        SELECT
          base_product.id,
          base_product.brand,
          base_product.name,
          base_product.price,
          base_product.description,
          base_product.image,
          auth_user.id AS seller_id,
          auth_user.username AS username
        FROM
          base_product
          LEFT JOIN base_productcategory ON base_productcategory.id = base_product.category_id
          LEFT JOIN base_productsubcategory ON base_productsubcategory.id = base_product.subcategory_id
          LEFT JOIN auth_user ON auth_user.id = base_product.seller_id
        WHERE
          base_productcategory.name ILIKE $1
          OR base_productsubcategory.name ILIKE $1
      `,
    params: (req) => [`%${req.query.search_string || ""}%`],
  },
  products_in_my_store: {
    query: `
        SELECT base_stock.id,
            jsonb_build_object('id', base_product.id, 'name', base_product.name, 'price', base_product.price, 'brand', base_product.brand) AS product,
            base_store.name AS storeName,
            base_stock.number,
            base_store.id AS store
        FROM base_stock
        JOIN base_store ON base_stock.store_id = base_store.id
        JOIN base_product ON base_stock.product_id = base_product.id
        WHERE base_store.id = $1
        AND (CAST(base_product.id AS TEXT) ILIKE '%' || $2 || '%'
            OR base_product.brand ILIKE '%' || $2 || '%'
            OR base_product.name ILIKE '%' || $2 || '%')
        GROUP BY base_stock.id,
                base_product.id,
                base_store.id
      `,
    params: (req) => [req.query.store_id, req.query.search_string || ""],
  },
  stores: {
    query: `
        SELECT base_store.*,
            base_profile.image AS profile_image,
            auth_user.username AS owner_name,
            base_profile_category.id,
            base_productcategory.name AS category
        FROM base_store
        LEFT JOIN auth_user ON base_store.owner_id = auth_user.id
        LEFT JOIN base_profile ON auth_user.id = base_profile.user_id
        LEFT JOIN base_profile_category ON base_profile.id = base_profile_category.profile_id
        LEFT JOIN base_productcategory ON base_profile_category.productcategory_id = base_productcategory.id
        WHERE ($1 = '%%'
            OR auth_user.username ILIKE $1
            OR base_productcategory.name ILIKE $1)
      `,
    params: (req) => [`%${req.query.search_string || ""}%`],
  },
  products_in_store: {
    query: `
        SELECT base_stock.id,
            jsonb_build_object('id', base_product.id, 'name', base_product.name, 'price', base_product.price, 'brand', base_product.brand, 'image', base_product.image) AS product,
            base_store.name AS storeName,
            base_stock.number,
            base_store.id AS store
        FROM base_stock
        JOIN base_store ON base_stock.store_id = base_store.id
        JOIN base_product ON base_stock.product_id = base_product.id
        WHERE base_store.id = $1
        AND (CAST(base_product.id AS TEXT) ILIKE '%' || $2 || '%'
            OR base_product.brand ILIKE '%' || $2 || '%'
            OR base_product.name ILIKE '%' || $2 || '%')
        GROUP BY base_stock.id,
                base_product.id,
                base_store.id
      `,
    params: (req) => [req.query.store_id, req.query.search_string || ""],
  },
};

module.exports = { queryMapping };
