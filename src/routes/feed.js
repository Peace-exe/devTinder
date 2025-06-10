const express= require('express');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const { userAuth }= require('../middlewares/auth');

const feedRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoURL skills about";

feedRouter.get("/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  try {
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    });

    const hiddenUsers = new Set();
    connectionRequest.forEach(req => {
      hiddenUsers.add(req.fromUserId.toString());
      hiddenUsers.add(req.toUserId.toString());
    });
    hiddenUsers.add(loggedInUser._id.toString());

   
    const visibleUsers = await User.find({
      _id: { $nin: Array.from(hiddenUsers) }
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      count: visibleUsers.length,
      feedData: visibleUsers
    });

  } catch (err) {
    console.error("Feed fetch error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});


module.exports=feedRouter;