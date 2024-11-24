import pool from "../database/database.js";

export const getSUK = async (req, res) => {
  const queryText = `SELECT * FROM SUK`;
  const queryResult = await pool.query(queryText);

  return res.json(queryResult.rows);
};
