import express from "express";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  getById,
  getByUserById,
  updateBlog,
} from "../controllers/blog-controller.js";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.get("/:id", getById);
blogRouter.delete("/:id", deleteBlog);
blogRouter.get("/user/:id", getByUserById);

export default blogRouter;
