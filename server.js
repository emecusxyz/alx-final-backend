const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const HealthData = require("./models/healthData");
const auth = require("./middleware/Auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

connectDB();

//----------------------------//
// Seeding some initial data
//----------------------------//

// const seedData = async () => {
//   try {
//     // Check if data already exists
//     const existingData = await HealthData.find();
//     if (existingData.length === 0) {
//       const initialData = [
//         {
//           date: new Date("2022-01-01"),
//           steps: 5000,
//           caloriesBurned: 200,
//           distanceCovered: 2.5,
//           weight: 70,
//         },
//         {
//           date: new Date("2022-01-02"),
//           steps: 8000,
//           caloriesBurned: 300,
//           distanceCovered: 3.2,
//           weight: 69,
//         },
//         // Add more initial data as needed
//       ];

//       await HealthData.insertMany(initialData);
//       console.log("Data seeded successfully.");
//     } else {
//       console.log("Data already exists. Skipping seed.");
//     }
//   } catch (error) {
//     console.error("Error seeding data:", error.message);
//   }
// };

// seedData();

// app.post("/login", async (req, res) => {
//   // Our login logic starts here
//   try {
//     // Get user input
//     const { email, password } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       return res.status(400).send({ message: "All input is required" });
//     }
//     // Validate if user exist in our database
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Create token
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );

//       // save user token
//       user.token = token;

//       // user
//       return res.status(200).json({
//         message: "Login Successful",
//         name: user.name,
//         email: user.email,
//         token,
//         data: [user],
//       });
//     }
//     return res.status(400).send({ message: "Invalid Credentials" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// //   // Our register logic ends here
// });
app.use("/tracks", auth, require("./routes/tracksRoutes"));
app.use("/register", require("./routes/registerRoute"));
app.use("/login", require("./routes/loginRoute"));
app.use("/", require("./routes/usersRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
