const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "MisionTic2021_secret_for_MisionBlog");
    next();
  } catch (error) {
    res.status(401).json({ message: "Autenticación fallida" });
  }
};
