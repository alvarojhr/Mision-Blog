const express = require("express");
const Post = require("../models/post");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");

router.get("", (req, res) => {
  Post.find().then((postResult) => {
    res.status(200).json(postResult);
  });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then((postResult) => {
    if (postResult) {
      res.status(200).json(postResult);
    } else {
      res.status(404).json({ message: "Post no encontrado con el id enviado" });
    }
  });
});

router.post("", checkAuth, (req, res) => {
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

router.delete("/:id", checkAuth, (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Post eliminado" });
  });
});

router.put("/:id", checkAuth, (req, res) => {
  console.log(req.params.id);
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Actualizacion ejecutada" });
  });
});

module.exports = router;
