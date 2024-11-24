import express from "express";
import { getAllKecamatan } from "../controllers/kecamatan.js";

const router = express.Router();

router.get("/", getAllKecamatan);

export default router;
