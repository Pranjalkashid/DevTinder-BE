const mongoose = require("mongoose");
const Validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 15,
    },
    emailId: {
      type: String,
      required: true,
      // index : true no need of this when unique is used
      unique: true, // unique index-indexed field in mongo db , when we search using email (findone (emailid)) it becomes faster.
      lowercase: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        return Validator.isStrongPassword(value);
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!Validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about....",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 5) {
          throw new Error("Error in skills");
        }
      },
    },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.createJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@", {
    expiresIn: "7d",
  });
  return token;
};

UserSchema.methods.validateUserPassword = async function (
  passwordInputFromUser,
) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputFromUser,
    passwordHash,
  );
  return isPasswordValid;
};

const UserModel = new mongoose.model("User", UserSchema);
module.exports = UserModel;
