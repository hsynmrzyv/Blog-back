import express from "express";

// Middleware
import { protectRoute } from "../middlewares/protectRoute.js";

// Controllers
import {
  createBlog,
  getBlogs,
  getBlogById,
} from "../controllers/blog.controller.js";

const router = express.Router();

// Create a new blog post
router.post("/", protectRoute, createBlog);

// Get all blog posts
router.get("/", getBlogs);

// Get a single blog post by ID
router.get("/:id", getBlogById);

export default router;
