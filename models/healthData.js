//--------------------------------//
// Define MongoDB schema and model
//--------------------------------//
const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  date: { type: Date, default: Date.now },
  steps: Number,
  caloriesBurned: Number,
  distanceCovered: Number,
  weight: Number,
});

module.exports = mongoose.model("HealthData", healthDataSchema);
