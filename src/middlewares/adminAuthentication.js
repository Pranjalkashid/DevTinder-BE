const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Invalid token, please login.");
    }

    const decoded = jwt.verify(token, "DevTinder@");

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).send("Auth Error: " + err.message);
  }
};

module.exports = userAuth;
