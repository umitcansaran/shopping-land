const pool = require("../db");

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

  module.exports = { getProductsByOwnerId };
