const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
 },
  message: {
    type: String,
    required: true 
},
  attachments: [String],
  isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  sentAt: { 
    type: Date,
    default: Date.now 
},
});

module.exports = mongoose.model("Message", messageSchema);
