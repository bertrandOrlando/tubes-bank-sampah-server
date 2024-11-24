import pool from "../database/database.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export const getSampah = async (req, res) => {
  let sql = `SELECT * FROM Sampah s INNER JOIN SUK ON s.suk_id = SUK.suk_id WHERE s.is_active=TRUE`;

  const queryResult = await pool.query(sql);

  return res.json(queryResult.rows);
};

export const getSingleSampah = async (req, res) => {
  const { sampah_id } = req.params;

  const sql = `SELECT * FROM Sampah s INNER JOIN SUK ON s.suk_id = SUK.suk_id WHERE s.is_active=TRUE AND s.sampah_id=$1`;

  const values = [sampah_id];

  const queryResult = await pool.query(sql, values);

  if (queryResult.rowCount === 0) {
    throw new NotFoundError("No sampah found");
  }

  return res.json(queryResult.rows[0]);
};

export const createSampah = async (req, res) => {
  const { nama_sampah, harga_sekarang, suk_id } = req.body;

  if (!req.file || !nama_sampah || !harga_sekarang || !suk_id) {
    throw new BadRequestError("All specified field must be included");
  }

  const sql = `INSERT INTO Sampah (nama_sampah, harga_sekarang, slug_image, suk_id) VALUES ($1, $2, $3, $4) RETURNING sampah_id`;
  const sampahValues = [nama_sampah, harga_sekarang, req.file.filename, suk_id];

  const queryResultSampah = await pool.query(sql, sampahValues);

  const sampah_id = queryResultSampah.rows[0].sampah_id;
  return res.status(200).json({ success: true, sampah_id });
};

export const updateSampah = async (req, res, next) => {
  const { sampah_id } = req.params;
  const { nama_sampah, harga_sekarang } = req.body;

  if (!nama_sampah && !harga_sekarang && !req.file) {
    throw new BadRequestError("Required at least 1 field");
  }

  const sampahValues = [];
  const sampahField = [];

  let placeHolderIdx = 1;
  if (nama_sampah) {
    sampahField.push(`nama_sampah = $${placeHolderIdx++}`);
    sampahValues.push(nama_sampah);
  }
  if (harga_sekarang) {
    sampahField.push(`harga_sekarang = $${placeHolderIdx++}`);
    sampahValues.push(harga_sekarang);
  }
  if (req.file) {
    sampahField.push(`slug_image = $${placeHolderIdx++}`);
    sampahValues.push(req.file.filename);
  }

  const queryTextSampah = `UPDATE Sampah SET ${sampahField.join(
    ", "
  )} WHERE sampah_id = $${placeHolderIdx++}`;
  sampahValues.push(sampah_id);

  const querySampahResult = await pool.query(queryTextSampah, sampahValues);

  if (querySampahResult.rowCount === 0) {
    next(new NotFoundError(`sampah_id ${sampah_id} not found`));
  }
  return res.status(200).json({ success: true, sampah_id });
};

export const deleteSampah = async (req, res) => {
  const { sampah_id } = req.params;

  const queryText = `UPDATE Sampah SET is_active = FALSE WHERE sampah_id = $1`;
  const values = [sampah_id];

  const queryResult = await pool.query(queryText, values);

  if (queryResult.rowCount === 0) {
    throw new NotFoundError(`sampah_id ${sampah_id} not found`);
  }

  return res.status(200).json({ success: true });
};
