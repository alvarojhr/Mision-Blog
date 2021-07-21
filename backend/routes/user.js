const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/user");

router.post("/signup", (req, res) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const newUser = new User({
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

module.exports = router;
