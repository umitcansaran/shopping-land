const pool = require("../db");

  const getReviewsByProductId = async (product_id) => {
    const query = `
    SELECT base_review.id,
       base_review.name,
       base_review.rating,
       base_review.comment,
       base_review."createdAt",
       base_review.user_id AS User,
       jsonb_build_object('id', base_product.id, 'brand', base_product.brand, 'name', base_product.name, 'price', base_product.price, 'description', base_product.description, 'image', base_product.image, 'rating', base_product.rating, 'numReviews', base_product."numReviews", 'createdAt', base_product."createdAt", 'seller', base_product.seller_id, 'category', base_product.category_id, 'subcategory', base_product.subcategory_id, 'sellerDetails', jsonb_build_object('id', auth_user.id, 'name', auth_user.username)) AS product
    FROM base_review
    LEFT JOIN base_product ON base_product.id = base_review.product_id
    LEFT JOIN auth_user ON auth_user.id = base_product.seller_id
    WHERE base_product.id = $1
    GROUP BY base_review.id,
            base_product.id,
            auth_user.id
    `;
    const result = await pool.query(query, [product_id]);
    return result.rows;
  };

  module.exports = { getReviewsByProductId };
