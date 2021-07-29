const express = require("express");
const multer = require("multer");
const Post = require("../models/post");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const MIME_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error("El tipo de archivo no es valido");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/files");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPES[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

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

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const postForAdd = new Post({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      imageUrl: url + "/files/" + req.file.filename,
      author: req.userData.userId,
    });
    postForAdd.save().then((createdPost) => {
      console.log("Agregado de manera exitosa!");
      res.status(201).json({
        post: {
          ...postForAdd,
          id: createdPost._id,
        },
      });
    });
  }
);

router.delete("/:id", checkAuth, (req, res) => {
  Post.deleteOne({ _id: req.params.id, author: req.userData.userId }).then(
    (result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Post eliminado" });
      } else {
        res.status(401).json({ message: "Autenticación fallida" });
      }
    }
  );
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
    let image = "";
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      image = url + "/files/" + req.file.filename;
    } else {
      image = req.body.imageUrl;
    }

    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      imageUrl: image,
      author: req.userData.userId,
    });
    Post.updateOne(
      { _id: req.params.id, author: req.userData.userId },
      post
    ).then((result) => {
      console.log(result);
      if (result.nModified > 0) {
        res.status(200).json({ message: "Actualizacion ejecutada" });
      } else {
        res.status(401).json({ message: "Autenticación fallida" });
      }
    });
  }
);

module.exports = router;
