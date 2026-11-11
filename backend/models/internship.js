const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "Applied"
    },
    deadline: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: ""
    },
    applicationLink: {
      type: String,
      default: ""
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);