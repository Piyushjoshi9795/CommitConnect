// Import dependencies
const express = require("express");
// const bcrypt = require("bcrypt");
const { connectDb } = require("./config/Database");
// const User = require("./Models/users");
// const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const app = express();

// this allows your react app to access your backend, credentials :true allows browser to send cookies , tokens etc..
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
); // middleware to call api from one origin to other(calling from frontend webservice)

app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser()); // middleware to parse cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

// login api when called check firs in authrouter if it gets login api then it sends the response back, similarly all api first go thrugh authrouter..

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// // ------------------- GET USER BY EMAIL -------------------
// app.get("/getuser", async (req, res) => {
//   try {
//     const { emailId } = req.query; // ✅ GET should use query param
//     if (!emailId) return res.status(400).send("EmailId required");

//     const userObj = await User.findOne({ emailId });
//     if (!userObj) return res.status(404).send("User not found");

//     res.send(userObj);
//   } catch (err) {
//     res.status(500).send("ERROR: " + err.message);
//   }
// });

// // ------------------- GET ALL USERS -------------------
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(500).send("ERROR: " + err.message);
//   }
// });

// // ------------------- DELETE USER -------------------
// app.delete("/deleteuser/:userid", async (req, res) => {
//   try {
//     const { userid } = req.params;
//     const deletedUser = await User.findByIdAndDelete(userid);

//     if (!deletedUser) return res.status(404).send("User not found");
//     res.send("User deleted successfully ❌");
//   } catch (err) {
//     res.status(500).send("ERROR: " + err.message);
//   }
// });

// // ------------------- UPDATE USER -------------------
// app.patch("/updateuser/:userid", async (req, res) => {
//   try {
//     const { userid } = req.params;
//     const userdata = req.body;

//     // ✅ Allowed fields
//     const allowedUpdates = ["firstName", "lastName", "password", "age", "gender", "photoUrl", "about", "skills"];

//     const isValid = Object.keys(userdata).every((key) => allowedUpdates.includes(key));
//     if (!isValid) return res.status(400).send("Update not allowed ❌");

//     // ✅ Hash password if updated
//     if (userdata.password) {
//       userdata.password = await bcrypt.hash(userdata.password, 10);
//     }

//     const updatedUser = await User.findByIdAndUpdate(userid, userdata, {
//       new: true, // return updated doc
//       runValidators: true,
//     });

//     if (!updatedUser) return res.status(404).send("User not found");
//     res.send("User updated successfully ✅");
//   } catch (err) {
//     res.status(500).send("ERROR: " + err.message);
//   }
// });

// ------------------- CONNECT DB & START SERVER -------------------
connectDb()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(4000, () => console.log("🚀 Server running on port 4000"));
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
  });
