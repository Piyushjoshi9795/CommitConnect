const express = require("express");
const requestRouter = express.Router();
const { adminAuth } = require("../middlewares/adminauth");

const ConnectionRequest = require("../Models/connectionRequest");

const User = require("../Models/users");
// api to send request
requestRouter.post("/request/send/:status/:toUserId", adminAuth, async (req, res) => {
  // adminauth is the middleware which checks for jwt token
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Incorrect Status type" });
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
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
      return res.status(400).send({ message: "Connection Request already exists !" });
    }
    const connectionRequest = await ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// api to accept /reject request
requestRouter.post("/request/review/:status/:requestId", adminAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;

    const loggedInUser = req.user;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(404).json({ message: "Status not allowed!!" });
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: "interested",
      toUserId: loggedInUser,
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({ message: "Connection request " + status, data });
  } catch (err) {
    res.status(404).send("ERROR " + err.message);
  }
});

module.exports = requestRouter;
