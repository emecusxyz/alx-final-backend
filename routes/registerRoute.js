const express = require("express");
const router = express.Router();
const registerController = require("../controller/register");

router.route("/").post(registerController.createANewUser);

module.exports = router;
