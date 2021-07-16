const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://admin:f7ZJm6pFO7fdbXAz@cluster0.54mkd.mongodb.net/MisionBlog?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Estamos a conectados a nuestra BD");
  })
  .catch(() => {
    console.log("Houston tenemos un problema");
  });

app.get("/api/posts", (req, res) => {
  Post.find().then((postResult) => {
    res.status(200).json(postResult);
  });
});

app.post("/api/posts", (req, res) => {
  console.log(req.body);
  const postForAdd = new Post({
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
  });
  postForAdd.save().then((createdPost) => {
    res.status(201).json({
      idPostAdded: createdPost._id,
    });
  });
});

app.delete("/api/posts/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post eliminado" });
  });
});

module.exports = app;
