import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js"; // Adjust the path based on your project structure
import blogRouter from "./routes/blog-routes.js";
const app = express();
app.use(express.json());

app.use("/api/user", router);
app.use("/api/blog", blogRouter);
mongoose
  .connect(
    "mongodb+srv://admin:Dsep0qMaOS4QOnLS@cluster0.tyg8fi3.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => app.listen(5000))
  .then(() =>
    console.log("Connected to the database and listening on localhost")
  )
  .catch((err) => console.error(err));
