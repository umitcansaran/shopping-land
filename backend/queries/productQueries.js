const pool = require("../db");

const getAllProducts = async (limit, offset) => {
  const query = `
    SELECT base_product.id, base_product.brand, base_product.name, base_product.price, base_product.description, base_product.image, base_product.seller_id, auth_user.username
    FROM base_product
    LEFT JOIN auth_user ON base_product.seller_id = auth_user.id 
    ORDER BY base_product.name DESC LIMIT $1 OFFSET $2
    `;
  const result = await pool.query(query, [limit, offset]);
  return result;
};

const getAllProductsBySeller = async (user_id) => {
  const query = `
    SELECT base_product.id, base_product.brand, base_product.name, base_product.price, base_product.description, base_product.image, base_product.seller_id, auth_user.username
    FROM base_product
    LEFT JOIN auth_user ON base_product.seller_id = auth_user.id 
    WHERE auth_user.id = $1
    ORDER BY base_product.name DESC
      `;
  const result = await pool.query(query, [user_id]);
  return result;
};

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
    GROUP BY base_product.id, auth_user.id
    `;
  const result = await pool.query(query, [product_id]);
  return result.rows;
};

const getMyProducts = async (ownerId) => {
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

const createProduct = async (
  category,
  brand,
  name,
  price,
  description,
  createdAt,
  image,
  seller
) => {
  const query = `
      INSERT INTO base_product (category_id, brand, name, price, description, "createdAt", image, seller_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, category_id, price, image;
    `;
  const values = [
    category,
    brand,
    name,
    price,
    description,
    createdAt,
    image,
    seller,
  ];
  const result = await pool.query(query, values);
  return result;
};

const getProductCategories = async () => {
  const query = `
    SELECT base_productcategory.*,
        json_agg(DISTINCT jsonb_build_object('id', base_productsubcategory.id, 'name', base_productsubcategory.name, 'category_id', base_productsubcategory.category_id)) AS subcategory
    FROM base_productcategory
    LEFT JOIN base_productsubcategory ON base_productsubcategory.category_id = base_productcategory.id
    GROUP BY base_productcategory.id
      `;
  const result = await pool.query(query);
  return result.rows;
};

const getLatestProductReviews = async () => {
  const query = `
    SELECT base_review.name, base_review.rating, base_review.comment, base_review.product_id, base_product.brand AS product_brand, base_product.image
    FROM base_review
    LEFT JOIN base_product ON base_review.product_id = base_product.id
    ORDER BY base_review."createdAt" DESC 
    LIMIT 5`;
  const result = await pool.query(query);
  return result;
};

module.exports = {
  getAllProducts,
  getAllProductsBySeller,
  getProductsById,
  getMyProducts,
  getProductsByStoreId,
  createProduct,
  getProductCategories,
  getLatestProductReviews,
};
