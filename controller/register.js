const User = require("../models/user");
const bcrypt = require("bcrypt");
const createANewUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(first_name && last_name && email && password)) {
      res.status(400).send({ message: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .send({ message: "User Already Exist. Please Login" });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    let result = user.save();
    res.status(201).json({ message: "User created succesfully", user });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { createANewUser };
