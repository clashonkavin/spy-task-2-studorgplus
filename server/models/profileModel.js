const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: false,
    default: null,
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
});

const profile = mongoose.model("profile", profileschema);
module.exports = profile;
