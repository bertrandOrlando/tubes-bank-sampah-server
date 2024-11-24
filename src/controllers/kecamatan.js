import pool from "../database/database.js";

export const getAllKecamatan = async (req, res) => {
  const sql = `SELECT * FROM Kecamatan`;

  const queryResult = await pool.query(sql);

  return res.json(queryResult.rows);
};
