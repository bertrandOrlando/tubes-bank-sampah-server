import { BadRequestError } from "../errors/BadRequestError.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import bcrypt from "bcryptjs";
import pool from "../database/database.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { password, noTelp, alamat, email, kelId, nama } = req.body;

  if (!password || !noTelp || !alamat || !email || !kelId || !nama) {
    throw new BadRequestError("All specified field must be included");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const textQuery = `INSERT INTO Pengguna (no_telp, alamat, email, kel_id, password, nama) VALUES ($1, $2, $3, $4, $5, $6)`;
  const values = [noTelp, alamat, email, kelId, hashedPassword, nama];

  await pool.query(textQuery, values);

  return res.status(200).json({ success: true });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("All specified field must be included");
  }

  const textQuery = `SELECT pengguna_id, password, email, role FROM Pengguna WHERE email = $1`;

  const queryResult = await pool.query(textQuery, [email]);

  if (queryResult.rowCount === 0) {
    throw new UnauthorizedError("Email is not registered");
  }

  const user = queryResult.rows[0];
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new UnauthorizedError("Incorrect password");
  }

  const token = jwt.sign(
    { pengguna_id: user.pengguna_id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  return res.status(200).json({ success: true, token });
};
