const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/adminAuthentication");
const connectionRequest = require("../Models/ConnectionRequest");
const user = require("../Models/User");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id; // logged in user
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type:" + status });
      }

      console.log("From:", fromUserId);
      console.log("To:", toUserId);

      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({ message: "Connection Req already sent" }); //its a match case explore and send its a match
      }

      const ConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await ConnectionRequest.save();
      console.log("Saved document:", data);
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "status not allowed !",
        });
      }
      const existingRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!existingRequest) {
        return res.status(404).json({
          message: "Connection not found ",
        });
      }

      existingRequest.status = status;
      const data = await existingRequest.save();
      res.json({ message: "connection request " + status, data });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  },
);

module.exports = { requestRouter };
