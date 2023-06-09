import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import 'dotenv/config'
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handelValidationErrors } from "./utils/index.js";

const MONGODB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@node-api.ppfibgf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("DB-work"))
  .catch((err) => console.log("db error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handelValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handelValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handelValidationErrors,
  PostController.create
);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handelValidationErrors,
  PostController.update
);
app.delete("/posts/:id", checkAuth, PostController.remove);

app.post("/posts/:id/save", checkAuth, PostController.saveToProfile);
app.get("/saved-post", checkAuth, PostController.showSavePost);
app.delete("/posts/:id/remove", checkAuth, PostController.removeFromProfile);


const PORT = process.env.PORT || 3001;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server-work");
});
