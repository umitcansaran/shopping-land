
const pool = require("../db");

  const getAllProfiles = async () => {
    const query = `
    SELECT base_profile.*,
        auth_user.username AS name
    FROM base_profile
    JOIN auth_user ON base_profile.user_id = auth_user.id
    `;
    const result = await pool.query(query);
    return result.rows;
  };

  module.exports = { getAllProfiles };