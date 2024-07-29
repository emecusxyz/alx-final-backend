const HealthData = require("../models/healthData");
const User = require("../models/user");

const getAllTracks = async (req, res) => {
  try {
    const allTracks = await HealthData.find();
    res.json(allTracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getAllTracksByDate = async (req, res) => {
  const requestedDate = new Date(req.params.date);
  try {
    const tracksForDay = await HealthData.find({
      date: {
        $gte: requestedDate,
        $lt: new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    res.json(tracksForDay);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const putATrack = async (req, res) => {
  const requestedDate = new Date(req.params.date);
  try {
    const existingTrack = await HealthData.findOne({
      date: {
        $gte: requestedDate,
        $lt: new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    console.log("existing track", existingTrack);

    if (existingTrack) {
      // Update existing track
      Object.assign(existingTrack, req.body);
      await existingTrack.save();
      res.json(existingTrack);
    } else {
      // Create new track for the day if it doesn't exist
      const newTrack = new HealthData({
        date: requestedDate,
        ...req.body,
      });
      await newTrack.save();
      console.log(newTrack);
      res.status(200).json(newTrack);
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const createANewHealthRec = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await User.findOne({ _id: user_id })
      .select("-password")
      .lean();
    if (user) {
      req.body.user = user;
    }

    console.log("user = ", req.body);
    const { date, steps, caloriesBurned, distanceCovered, weight } = req.body;

    // Validate user input
    if (!(date && steps && caloriesBurned && distanceCovered && weight)) {
      res.status(400).send({ message: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await HealthData.findOne({ date: date });

    if (oldUser) {
      return res.status(409).send({ message: "Data Already Exist." });
    }
    const health = await HealthData.create(req.body);
    // const health = new HealthData({
    //   user,
    //   date,
    //   steps,
    //   caloriesBurned,
    //   distanceCovered,
    //   weight,
    // });

    // let result = health.save();
    res.status(201).json({ message: "data created succesfully", health });
  } catch (err) {
    console.log(err.message);
  }
};

const getASingleuserTrack = async (req, res) => {
  try {
    const { user_id } = req.user;
    const singleUser = await HealthData.findOne({ user: user_id })
      .select("-password")
      .lean();
    if (singleUser) {
      res.json([singleUser]);
    }
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({
      error: "Internal Server vhvhvh Error",
    });
  }
};

module.exports = {
  getAllTracks,
  getAllTracksByDate,
  putATrack,
  createANewHealthRec,
  getASingleuserTrack,
};
