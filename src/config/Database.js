const mongoose = require("mongoose");
const url =
  "mongodb+srv://pranjal_db_user:F7GkGG55XYBQADYl@maincluster.rrncdr4.mongodb.net/DevTinderDB";

async function connectDB() {
  await mongoose.connect(url);
  console.log(" mongoo connected successfully");
  return "done";
}
module.exports = connectDB;
