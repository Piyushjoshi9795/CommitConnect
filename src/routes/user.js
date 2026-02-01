const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../Models/connectionRequest");
const { adminAuth } = require("../middlewares/adminauth");
const users = require("../Models/users");

// api to get all pending request
userRouter.get("/user/requests/pending", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age")
    .lean(); // populate is used to populate data of referenced collection (in this case user collection is referenced)

    // the elements passed in array will be reflected from user collection.
    // if you didnot pass anything , it will give all data from user collection including password and all - not  a good approach
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR ! " + err.message);
  }
});

userRouter.get("/user/connections", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser, status: "accepted" },
        { toUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "age", "gender", "photoUrl", "About", "Skills"])
      .populate("toUserId", ["firstName", "lastName", "age", "gender", "photoUrl", "About", "Skills"]); // we can also create const for this firstname and all

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) return row.toUserId;
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR ! " + err.message);
  }
});

userRouter.get("/feed", adminAuth, async (req, res) => {
  // users should not see cards :
  // 1- his own card
  // 2- his connections
  // 3- ignored people
  // 4- already sent the connection request

  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const showUsers = await users
      .find({
        $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } }, { _id: { $ne: loggedInUser._id } }],
      })
      .select("firstName lastName age gender photoUrl About Skills")
      .skip(skip)
      .limit(limit);

    res.send(showUsers);
  } catch (err) {
    res.status(400).send("ERROR! " + err.message);
  }
});
module.exports = userRouter;
