import express from "express";

// Controllers
import { signIn, signUp, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Sing in
router.post("/sign-in", signIn);

// Sign up
router.post("/sign-up", signUp);

// Log out
router.post("/log-out", logout);

export default router;
