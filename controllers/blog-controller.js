import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (error) {
    return console.log(error);
  }
  if (!blogs) {
    return res.status(404).json({ message: "no blogs found" });
  }
  res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  // new changes here
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (error) {
    return console.log(error);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find user by ID" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });

  try {
    // await blog.save();
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;

  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    res.status(500).json({ message: "unable to update the blog" });
  }
  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    return res.status(500).json({ message: "No blog found" });
  }
  return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id).populate("user");
    // await blog.user.blogs.pull(blog);
    // await blog.user.save();
    if (blog.user) {
      await blog.user.blogs.pull(blog);
      await blog.user.save();
    } else {
      console.log("User is undefined for the blog entry.");
    }
  } catch (error) {
    return console.log(error);
  }
  if (!blog) {
    return res.status(404).json({ message: "unable to delete" });
  }
  return res.status(200).json({ message: "Successfully deleted" });
};

// export const deleteBlog = async (req, res, next) => {
//   const id = req.params.id;

//   try {
//     const blog = await Blog.findById(id).populate("user");

//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     const userId = blog.user._id;

//     await blog.remove();

//     // Ensure the user object is populated before accessing the 'blogs' property
//     const user = await User.findById(userId).populate("blogs");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Remove the reference to the deleted blog from the user's 'blogs' array
//     user.blogs.pull(id);
//     await user.save();

//     return res.status(200).json({ message: "Successfully deleted" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const getByUserById = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;

  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    return console.log(error);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "no Blog Found" });
  }
  return res.status(200).json({ blogs: userBlogs });
};
