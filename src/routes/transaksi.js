import express from "express";
import { authMiddleware } from "../middleware/roleAuthentication.js";
import {
  getAllTransaksi,
  createTransaksi,
  getPenggunaTransaksi,
} from "../controllers/transaksi.js";

const router = express.Router();

router.get("/", authMiddleware("all"), getPenggunaTransaksi);
router.get("/all", authMiddleware("admin"), getAllTransaksi);

router.post("/", authMiddleware("admin"), createTransaksi);

export default router;
