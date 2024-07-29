require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HealthData = require("../models/healthData");
const bcrypt = require("bcrypt");
const user = require("../models/user");
const login = async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send({ message: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, user },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json({
        message: "Login Successful",
        name: user.name,
        email: user.email,
        token,
        data: [user],
      });
    }
    return res.status(400).send({ message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  // Our register logic ends here
};

module.exports = { login };
