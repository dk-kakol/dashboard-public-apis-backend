const mongoose = require("mongoose");

const corsSchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Cors", corsSchema);
