import pkg from "pg";
import { DB_CONFIG } from "../config/appConfig.js";
const { Pool } = pkg;

const pool = new Pool({
  user: DB_CONFIG.USER,
  host: DB_CONFIG.HOST,
  database: DB_CONFIG.DATABASE,
  password: DB_CONFIG.PASSWORD,
  port: DB_CONFIG.PORT,
});

export default pool;
