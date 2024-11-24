import express from "express";
import {
  createSampah,
  deleteSampah,
  getSampah,
  getSingleSampah,
  updateSampah,
} from "../controllers/sampah.js";
import { authMiddleware } from "../middleware/roleAuthentication.js";
import { fileUpload } from "../middleware/fileUploader.js";

const router = express.Router();

router.get("/", getSampah);

router.get("/:sampah_id", getSingleSampah);

router.post(
  "/",
  authMiddleware("admin"),
  fileUpload("./public").single("gambarSampah"),
  createSampah
);

router.patch(
  "/:sampah_id",
  authMiddleware("admin"),
  fileUpload("./public").single("gambarSampah"),
  updateSampah
);

router.delete("/:sampah_id", authMiddleware("admin"), deleteSampah);

export default router;
