const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../Utils/Validation");
const User = require("../Models/User");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res, next) => {
  try {
    validateSignUpData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      skills,
      photoUrl,
      about,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      skills,
      photoUrl,
      about,
    });

    const saveduser = await user.save();

    const token = await saveduser.createJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 3600000),
    });

    res.json({ message: "Data saved successfully!!", data: saveduser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId }); // email id convert to small case first then check
    if (!user) {
      throw new Error("Email not present in DB");
    }
    const isPasswordvalid = await user.validateUserPassword(password);
    if (isPasswordvalid) {
      const token = await user.createJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });

      res.send(user);
    } else {
      throw new Error("Invalid credentials, try again.");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

authRouter.post("/logout", async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("logout successful");
});

authRouter.post("/forgotPassword", async (req, res, next) => {
  try {
    const { emailId } = req.body;
    if (!emailId) {
      return res.status(400).send("Email is required");
    }
    const user = await User.findOne({ emailId: emailId.toLowerCase() });
    if (!user) {
      throw new Error("Email not present in DB");
    }

    res.send("Reset link will be sent if email exists");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = { authRouter };
