const mongoose = require("mongoose");
const User = require("../Models/User");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

// any time save is called this function will be called thats why its pre save
ConnectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send request to yourself.");
  }
  // why next() is not used ? why you removed it
});

const ConnectionRequestModal = new mongoose.model(
  "ConnectionRequest", // is this name used anywhere ?
  ConnectionRequestSchema,
);
module.exports = ConnectionRequestModal;
