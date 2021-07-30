const User = require("../models/user");

exports.listUsers = (req, res) => {
  User.find().then((userResult) => {
    res.status(200).json(userResult);
  });
};
