const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "head", "grouphead", "employee"],
    default: "employee",
  },
  empid: {
    type: Number,
    unique: true,
    sparse: true,
  },
  dept: {
    type: String,
    enum: [
      "hr",
      "legal",
      "finance",
      "it",
      "sales",
      "operations",
      "rnd",
      "marketing",
    ],
  },
  dateOfJoining: {
    type: Date,
  },
  reportingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
