const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
  addApisLimit: { type: Number, default: 1 },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  imagePath: { type: String }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
