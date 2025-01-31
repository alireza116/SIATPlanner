const mongoose = require("mongoose");

const ActionSwotRelationSchema = new mongoose.Schema(
  {
    actionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Action",
      required: true,
    },
    swotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwotEntry",
      required: true,
    },
    reasoning: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActionSwotRelation", ActionSwotRelationSchema);
