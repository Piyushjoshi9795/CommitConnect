const express = require("express");
const profileRouter = express.Router();
const { adminAuth } = require("../middlewares/adminauth");
const { validateEditeProfileData } = require("../utils/validation");

//------------------- GET USER PROFILE---------------------
profileRouter.get("/profile/view", adminAuth, async (req, res) => {
  try {
    // validate using secret key
    // it will give decoded message which consist of userid that you have passed on login
    const user = req.user;

    if (!user) {
      throw new Error("User doesn't exist");
    }
    res.send("Logged In user is: " + user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

profileRouter.post("/profile/edit", adminAuth, async (req, res) => {
  try {
    if (!validateEditeProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    console.log(loggedInUser);

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
