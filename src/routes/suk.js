import express from "express";
import { getSUK } from "../controllers/suk.js";

const router = express.Router();

router.get("/", getSUK);

export default router;
