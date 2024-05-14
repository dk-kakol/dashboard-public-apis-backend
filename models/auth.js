const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
  name: { type: String }, // could be empty string, that's why its not required here
});

module.exports = mongoose.model("Auth", authSchema);
