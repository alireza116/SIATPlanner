const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    swotEntries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SwotEntry",
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Action", ActionSchema);
