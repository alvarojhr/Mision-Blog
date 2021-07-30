const express = require("express");
const router = express.Router();
const Usercontroller = require("../controllers/user");

const checkAuth = require("../middleware/check-auth");

router.get("", checkAuth, Usercontroller.listUsers);

module.exports = router;
