const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // e.g., emp + group head
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastMessageAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Thread", threadSchema);
