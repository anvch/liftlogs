import express from "express";
import { registerUser, loginUser } from "../models/authModel.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

export default router;