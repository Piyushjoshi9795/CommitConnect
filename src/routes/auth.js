const express = require("express");
const authRouter = express.Router();
const User = require("../Models/users");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { adminAuth } = require("../middlewares/adminauth");

// ------------------- SIGNUP -------------------
authRouter.post("/signup", async (req, res) => {
  try {
    // ✅ Validate input
    validateSignupData(req);

    const { firstName, lastName, emailId, password,photoUrl } = req.body;

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Create user
    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
    });

    const savedUser = await userObj.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production (https)
  sameSite: "lax",
  expires: new Date(Date.now() + 8 * 3600000),
});
    res.json({ message: "User registered successfully ✅", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ------------------- LOGIN -------------------
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const userObj = await User.findOne({ emailId });
    if (!userObj) {
      return res.status(400).send("Invalid credentials ❌");
    }

    // password validation will be done by helper function
    // const isPasswordValid = await bcrypt.compare(password, userObj.password); // compares the login password with the password present in db

    const isPasswordValid = await userObj.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials ❌");
    }
    // create a jwt token if password valid, this will done by helper function. getJWT()
    // const token = await jwt.sign({ _id: userObj._id }, "Buggasosat@123", { expiresIn: "1d" }); // object id is passed and it will validate which user is login, BUggasosat@123 is a secret key
    const token = await userObj.getJWT();

    console.log(token);

    res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production
  sameSite: "lax",
});
    res.send(userObj);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

// ------------------- LOGOUT ------------------

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successfull");
});

authRouter.get("/me",adminAuth, async(req,res)=>{
  res.json({data: req.user});
});

module.exports = authRouter;
