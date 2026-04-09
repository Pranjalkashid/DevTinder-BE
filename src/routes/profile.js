const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/adminAuthentication");
const { validateEditProfileData } = require("../Utils/Validation");
const User = require("../Models/User"); // ✅ must be at top

profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res.send(user); // you are sending password also , restrict it
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    // console.log("loggedInUser old", loggedInUser);
    // loggedInUser.firstName = req.body.firstName;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    // console.log( "loggedInUser new", loggedInUser);
    loggedInUser.save();
    // res.send(`${loggedInUser.firstName} , successfully`);
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      // data: loggedInUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { profileRouter };
