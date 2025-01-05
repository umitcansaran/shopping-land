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

const getProfileById = async (profile_id) => {
  const query = `
    SELECT base_profile.*,
      auth_user.username AS name
    FROM base_profile
    JOIN auth_user ON base_profile.user_id = auth_user.id
    WHERE base_profile.id = $1
    `;
  const result = await pool.query(query, [profile_id]);
  return result.rows;
};

const createProfile = async (user, status) => {
  const query = `
    INSERT INTO base_profile (user_id, status) 
    VALUES ($1, $2) 
    RETURNING id, status
      `;
  const result = await pool.query(query, [user, status]);
  return result.rows[0];
};

const latestSellerProfiles = async () => {
  const query = `
    SELECT * 
    FROM base_profile 
    WHERE status = 'STORE_OWNER' 
    ORDER BY id DESC LIMIT 5`
;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { getAllProfiles, getProfileById, createProfile, latestSellerProfiles };
