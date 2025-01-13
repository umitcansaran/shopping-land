const pool = require("../db");

const getAllStocks = async () => {
  const query = `
    SELECT base_stock.id,
       json_agg(DISTINCT jsonb_build_object('id', base_product.id, 'name', base_product.name, 'price', base_product.price, 'brand', base_product.brand)) AS product,
       base_store.name AS "storeName",
       base_stock.number,
       base_store.id AS store
    FROM base_stock
    JOIN base_store ON base_stock.store_id = base_store.id
    JOIN base_product ON base_stock.product_id = base_product.id
    GROUP BY base_stock.id,
            base_store.id;
    `;
  const result = await pool.query(query);
  return result.rows;
};

const getAllStocksByStore = async (storeId) => {
    const query = `
      SELECT base_stock.id,
       jsonb_build_object('id', base_product.id, 'name', base_product.name, 'price', base_product.price, 'brand', base_product.brand) AS product,
       base_store.name AS "storeName",
       base_stock.number,
       base_store.id AS store
    FROM base_stock
    JOIN base_store ON base_stock.store_id = base_store.id
    JOIN base_product ON base_stock.product_id = base_product.id
    WHERE base_store.id = $1
    GROUP BY base_stock.id,
            base_product.id,
            base_store.id;
      `;
    const result = await pool.query(query, [storeId]);
    return result.rows;
  };

  const getAllStocksByProduct = async (storeId) => {
    const query = `
      SELECT base_stock.id,
       jsonb_build_object('id', base_product.id, 'name', base_product.name, 'price', base_product.price, 'brand', base_product.brand) AS product,
       base_store.name AS "storeName",
       base_stock.number,
       base_store.id AS store
    FROM base_stock
    JOIN base_store ON base_stock.store_id = base_store.id
    JOIN base_product ON base_stock.product_id = base_product.id
    WHERE base_product.id = $1
    GROUP BY base_stock.id,
            base_product.id,
            base_store.id;
      `;
    const result = await pool.query(query, [storeId]);
    return result.rows;
  };

module.exports = { getAllStocks, getAllStocksByStore, getAllStocksByProduct };
