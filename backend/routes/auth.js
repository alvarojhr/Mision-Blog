const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const Auth = require("../models/user");

router.post("/signup", (req, res) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const newUser = new Auth({
      username: req.body.name,
      email: req.body.email,
      password: hash,
    });
    newUser
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({ message: "Usuario creado", result: result });
      })
      .catch((err) => {
        console.log(result);
        res.status(500).json({ error: err });
      });
  });
});

router.post("/login", (req, res) => {
  let userGet;
  Auth.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Autenticación fallida" });
      }
      userGet = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "Autenticación fallida" });
      }
      const token = jwt.sign(
        { email: userGet.email, userId: userGet._id },
        "MisionTic2021_secret_for_MisionBlog",
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({ token: token, expiresIn: 3600, userId: userGet._id });
    })
    .catch((err) => {
      return res.status(401).json({ message: "Autenticación fallida" });
    });
});

module.exports = router;
