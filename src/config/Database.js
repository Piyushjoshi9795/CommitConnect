const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect("mongodb+srv://piyushjoshi9795:Piyush123@nodecluster.g0mjusd.mongodb.net/devTinder");
};

module.exports = {
  connectDb,
};
