const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  sem: {
    type: Number,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  due: {
    type: mongoose.SchemaTypes.Date,
    required: true,
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
  state: {
    type: String,
    required: false,
    default: "incomplete",
  },
});

const ass = mongoose.model("ass", assschema);
module.exports = ass;
