const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router
  .route("/user")
  .get(UserController.getAllUsers)
  .delete(UserController.deleteAUser);

module.exports = router;
