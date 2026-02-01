const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL:" + value);
        }
      },
    },
    About: {
      type: String,
      default: "This is a default about",
    },
    Skills: {
      type: [String],
    },
  },
  { timestamps: true } // 👈 this adds createdAt & updatedAt
);

// helper function to create a jwt token
userSchema.methods.getJWT = async function () {
  const user = this; // "this" will not work inside an arrow function, this here denotes the user who is login

  const token = await jwt.sign({ _id: user._id }, "Buggasosat@123", { expiresIn: "1d" });
  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(password, passwordHash);

  return isPasswordValid;
};

module.exports = mongoose.model("user", userSchema);
