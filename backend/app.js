const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/files", express.static(path.join("backend/files")));

mongoose
  .connect(
    "mongodb+srv://admin:f7ZJm6pFO7fdbXAz@cluster0.54mkd.mongodb.net/MisionBlog?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Estamos a conectados a nuestra BD");
  })
  .catch(() => {
    console.log("Houston tenemos un problema");
  });

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
