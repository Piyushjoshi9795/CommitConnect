const mongoose = require("mongoose");

// schema for connection request send by one user to another
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, // since we need type as object id of mongo db
      ref: "user",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // reference from user collection. works like join
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "interested", "ignored", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // compound indexing

// this pre is basically a middle ware provided ny mongoose, and this is will call everytime before saving the data in database for validation purpose
// this is optional we can do same check in api call
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if fromuserid is euqal to touserid i.e. user is sneding request to himself

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection Request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
