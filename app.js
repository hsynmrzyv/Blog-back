import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import cors from "cors";

// Routes
import AuthRoute from "./routes/auth.routes.js";
import BlogRoute from "./routes/blog.routes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

// Storages
const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images/ProfilePictures");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const coverPictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images/CoverPictures");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Uploads
const profilePictureUpload = multer({ storage: profilePictureStorage });
const coverPictureUpload = multer({ storage: coverPictureStorage });

app.use(express.json());
app.use(cookieParser());
app.use(express.static("./"));

app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

app.use("/api/auth", profilePictureUpload.single("profilePic"), AuthRoute);
app.use("/api/blog", coverPictureUpload.single("coverPic"), BlogRoute);

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });
