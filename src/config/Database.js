const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb+srv://piyushjoshi9795:Piyush123@nodecluster.g0mjusd.mongodb.net/devTinder";
  await mongoose.connect(mongoUri);
};

module.exports = {
  connectDb,
};
