const pool = require("../db");

const getProductsById = async (product_id) => {
    const query = `
    SELECT base_product.id,
       base_product.brand,
       base_product.name,
       base_product.price,
       base_product.description,
       base_product.image,
       base_product.rating,
       base_product."numReviews",
       base_product."createdAt",
       base_product.seller_id AS seller,
       base_product.category_id AS category,
       base_product.subcategory_id AS subcategory,
       jsonb_build_object('id', auth_user.id, 'name', auth_user.username) AS "sellerDetails"
    FROM base_product
    LEFT JOIN auth_user ON auth_user.id = base_product.seller_id
    WHERE base_product.id = $1
    GROUP BY base_product.id,
            auth_user.id
    `;
    const result = await pool.query(query, [product_id]);
    return result.rows;
  };

const getProductsByOwnerId = async (ownerId) => {
    const query = `
    SELECT 
        base_product.id, 
        base_product.brand, 
        base_product.name, 
        base_product.price, 
        base_product.description, 
        base_product.image, 
        base_product.rating, 
        base_product."numReviews", 
        base_product.seller_id, 
        base_product.category_id, 
        base_product.subcategory_id, 
        auth_user.username
    FROM 
        base_product
    LEFT JOIN 
        auth_user 
    ON 
        base_product.seller_id = auth_user.id
    WHERE 
        base_product.seller_id = $1
    ORDER BY 
        base_product.id ASC;
    `;
    const result = await pool.query(query, [ownerId]);
    return result.rows;
  };

  const getProductsByStoreId = async (storeId) => {
    const query = `
    SELECT 
        base_product.id, 
        base_product.brand, 
        base_product.name, 
        base_product.price, 
        base_product.description, 
        base_product.image, 
        base_product.rating, 
        base_product."numReviews", 
        base_product.seller_id, 
        base_product.category_id, 
        base_product.subcategory_id, 
        auth_user.username
    FROM 
        base_product
    LEFT JOIN 
        auth_user 
    ON 
        base_product.seller_id = auth_user.id
    WHERE 
        base_product.seller_id = $1
    ORDER BY 
        base_product.id ASC;
    `;
    const result = await pool.query(query, [storeId]);
    return result.rows;
  };

  module.exports = { getProductsById, getProductsByOwnerId, getProductsByStoreId };
