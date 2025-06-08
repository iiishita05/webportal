
const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true, 
      required: true,
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: { type: String, required: true },
    currentHandler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending Group Head",
        "Pending Head Approval",
        "approved",
        "rejected",
      ],
      default: "Pending Group Head",
    },
    history: {
      type: [
        {
          actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          role: String,
          action: String,
          remark: String,
          date: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
