const mongoose = require("mongoose");

const SwotEntrySchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    type: {
      type: String,
      enum: ["Strength", "Weakness", "Opportunity", "Threat"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SwotEntry", SwotEntrySchema);
