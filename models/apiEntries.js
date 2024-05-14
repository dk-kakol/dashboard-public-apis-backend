const mongoose = require('mongoose');

const apiEntrySchema =  mongoose.Schema({
  API: { type: String, required: true },
  Description: { type: String, required: true },
  Auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
  },
  HTTPS: { type: Boolean, required: true },
  Cors: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cors',
    required: true,
  },
  Link: { type: String, required: true },
  Category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  Creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ApiVerified: { type: Boolean, default: false }
})

module.exports = mongoose.model('ApiEntry', apiEntrySchema);