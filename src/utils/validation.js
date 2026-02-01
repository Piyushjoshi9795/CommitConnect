const validator = require("validator");

//------ To validate signup data----------------
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name not defined");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email address");
  }
  //   if (!validator.isStrongPassword(password)) {
  //     throw new Error("Please try a stronger password");
  //   }
};

// -------- To validate update profile data
const validateEditeProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "photoUrl", "gender", "age", "About", "Skills"];

  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

module.exports = {
  validateSignupData,
  validateEditeProfileData,
};
