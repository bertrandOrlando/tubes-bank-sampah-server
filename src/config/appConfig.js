import dotenv from "dotenv";

dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV;

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

export const DB_CONFIG = {
  USER: process.env.DB_USER,
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_DATABASE,
  PASSWORD: process.env.DB_PASSWORD,
  PORT: process.env.DB_PORT,
};

export const CORS_URL = process.env.CORS_URL;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_LIFETIME = process.env.JWT_LIFETIME;
