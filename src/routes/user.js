import express from "express";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  getSingleUser,
} from "../controllers/user.js";
import { authMiddleware } from "../middleware/roleAuthentication.js";

const router = express.Router();

router.get("/users", authMiddleware("admin"), getAllUsers);
router.get("/users/:pengguna_id", authMiddleware("admin"), getSingleUser);
router.patch("/users/:pengguna_id", authMiddleware("admin"), updateUser);
router.post("/register", register);
router.post("/login", login);

export default router;
