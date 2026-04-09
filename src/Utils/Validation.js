const validator = require("validator");

const validateSignUpData = (req) => {
  console.log("validate func called");
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First Name and Last Name required!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateEditProfileData= (req) => {
 
const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills","photoUrl", "about"];
const isEditAllowed = Object.keys(req.body).every(field=>allowedEditFields.includes(field))

return isEditAllowed;
 }

module.exports = { validateSignUpData, validateEditProfileData };
