// user.controller.js
const User = require("../models/user.model.js");
const Listing = require("../models/listing.model.js");
const bcryptjs = require("bcryptjs");
const CustomError = require("../utils/error/CustomError.js");
const { asyncErrorHandler } = require("../utils/error/errorHelpers.js");



const getMetrics = asyncErrorHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Listing.countDocuments();
    res.status(200).json({ totalUsers, totalProperties });
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
});

const updateUser = asyncErrorHandler(async (req, res) => {
  if (req.user.id !== req.params.id)
    throw new CustomError("Not Allowed To Update Data", 401);

  const allowedFields = ["username", "email", "avatar", "password", "mobileNo", "fullname"];
  let obj = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) obj[field] = req.body[field];
  });

  if (obj.password) {
    obj.password = bcryptjs.hashSync(obj.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, obj, {
    new: true,
    runValidators: true,
    select: { __v: 0, createdAt: 0, updatedAt: 0, password: 0 },
  });

  if (!updatedUser)
    throw new CustomError("User With Given Id Not Found", 404);

  return res.status(200).json({ ...updatedUser._doc });
});

const deleteUser = asyncErrorHandler(async (req, res) => {
  if (req.user.id !== req.params.id)
    throw new CustomError("Not Allowed To Update Data", 401);

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    throw new CustomError("User With Given Id Not Found", 404);
  await Listing.deleteMany({ owner: req.user.id });
  res.clearCookie("refreshToken");
  res.clearCookie("userId");
  res.clearCookie("tokenId");
  res.status(200).json({ message: "account deleted successfully" });
});

const getAgents = async (req, res) => {
  try {

  
    const agents = await User.find({ role: { $in: ["broker", "buyer", "builder"] } })
      .select("fullname email mobileNo role")
      .lean();
   
    res.status(200).json(agents);
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

module.exports = { updateUser, deleteUser, getMetrics, getAgents };