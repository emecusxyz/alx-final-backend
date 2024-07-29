const User = require("../models/user");
const HealthData = require("../models/healthData");
const bcrypt = require("bcrypt");
const user = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const Users = await User.find().select("-password").lean();
    if (!Users) {
      return res.status(400).json({ message: "No users found" });
    }
    res.json(Users);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const deleteAUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "User ID required" });

    const healthdata = await HealthData.findOne({ user: id }).lean().exec();
    if (healthdata) {
      return res.status(400).json({ message: "user has a health data record" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const result = await User.findByIdAndDelete(id);
    const reply = `Username ${result.first_name}  with ID ${result._id} deleted`;
    res.json(reply);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = { getAllUsers, deleteAUser };
