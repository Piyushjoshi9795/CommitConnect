const jwt = require("jsonwebtoken");
const User = require("../Models/users");
require("dotenv").config();

// middleware to verify the jwt token for all apis called, after user loggedin
const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET); // it will give decoded message which consist of userid that you have passed on login

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next(); // it will go to request handler
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};
module.exports = {
  adminAuth,
};
