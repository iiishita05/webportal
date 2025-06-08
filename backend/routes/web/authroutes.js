const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
require("dotenv").config();

router.post("/register", async (req, res) => {
  const { name, password, email, role, reportingTo } = req.body;

  if (!name || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingMailUser = await User.findOne({ email });
    if (existingMailUser)
      return res.status(400).json({ error: "E-Mail already exists" });

    const newUser = new User({
      name,
      email,
      password,
      role,
      reportingTo: reportingTo || null,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid E-Mail" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});
router.get("/", async (req, res) => {
  try {
    const allusers = await User.find();
    res.json(allusers);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
});
router.put("/update-email/:email", async (req, res) => {
  try {
    const { email: newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ error: "New email required" });

    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { email: newEmail },
      { new: true }
    );
    if (!updatedUser)
return res.status(404).json({ message: "User not found" });
     res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update email" });
  }
});

router.put("/update-pass/:id", async (req, res) => {
  try {
    const hashedpass= await bcrypt.hash(req.body.password, 10);

    const newp = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedpass },
      { new: true }
    );
    if (!newp) return res.status(404).json({ message: "User not found" });
    res.json(newp);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

module.exports = router;
