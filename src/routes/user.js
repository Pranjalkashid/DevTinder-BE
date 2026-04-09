const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/adminAuthentication");
const connectionRequest = require("../Models/ConnectionRequest");
const User = require("../Models/User");
// get all the pendong requests for the user
userRouter.get("/user/requests/received", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const requests = await connectionRequest
      .find({
        // findOne returns an object , find returns a array
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "about",
        "skills",
        "photoUrl",
        "age",
        "gender",
      ]); // added this field "fromUserId"  and inside it fetching first Name and last Name only
    // we have created a reference to user table therefore we able to get first name last name of from user
    res.json({
      message: "Data fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
// who are my connections - in future you can add a feature to chat with them
userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const requests = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" }, // logged in user is "to" user OR "from" user
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate(
        "fromUserId",
        "firstName lastName age gender skills photoUrl about",
      )
      .populate(
        "toUserId",
        "firstName lastName age gender skills photoUrl about",
      );

    // .populate("fromUserId", [
    //   "firstName lastName age gender skills photoUrl about",
    // ])

    const data = requests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        // if fromUserId is there and dont send the data bcz its you only, as you accepted the request
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Your Connections data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
// gets the users on feed
userRouter.get("/feed", userAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10; // send 10 users at a time
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const requests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    requests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString()); // the ids which
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender about skills photoUrl")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
