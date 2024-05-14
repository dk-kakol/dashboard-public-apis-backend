const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const permissionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

permissionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Permission", permissionSchema);
