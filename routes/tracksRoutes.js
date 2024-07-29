const express = require("express");
const router = express.Router();
const HealthController = require("../controller/HealthController");

router.route("/single").get(HealthController.getASingleuserTrack);

router
  .route("/")
  .get(HealthController.getAllTracks)
  .post(HealthController.createANewHealthRec);
router
  .route("/:date")
  .get(HealthController.getAllTracksByDate)
  .put(HealthController.putATrack);

module.exports = router;
