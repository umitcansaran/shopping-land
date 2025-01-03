const pool = require("../db");

const getUserDetailsById = async (ownerId) => {
  const query = `
    SELECT auth_user.*,
       jsonb_build_object(
           'id', base_profile.id,
           'name', auth_user.username,
           'status', base_profile.status,
           'user', base_profile.user_id,
           'description', base_profile.description,
           'headquarter', base_profile.headquarter,
           'image', base_profile.image,
           'industry', base_profile.industry,
           'categoryDetails', json_agg(jsonb_build_object(
               'id', base_productcategory.id,
               'name', base_productcategory.name
           ))
       ) AS profile
    FROM auth_user
    LEFT JOIN base_profile ON auth_user.id = base_profile.user_id
    LEFT JOIN base_profile_category ON base_profile.id = base_profile_category.profile_id
    LEFT JOIN base_productcategory ON base_profile_category.productcategory_id = base_productcategory.id
    WHERE auth_user.id = $1
    GROUP BY auth_user.id, base_profile.id;
      `;
  const result = await pool.query(query, [ownerId]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const query = `
    SELECT auth_user.*,
      jsonb_build_object(
        'id', base_profile.id,
        'status', base_profile.status
      ) AS profile
    FROM auth_user
    LEFT JOIN base_profile ON auth_user.id = base_profile.user_id;`;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { getUserDetailsById, getAllUsers };
