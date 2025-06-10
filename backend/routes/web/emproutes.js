const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Add employee
router.post("/addemp", async (req, res) => {
  try {
    const { email, empid, name, position } = req.body;

    const existingMail = await User.findOne({ email });
    if (existingMail)
      return res.status(400).json({ error: "E-Mail already exists" });

    const existingId = await User.findOne({ empid });
    if (existingId)
      return res.status(400).json({ error: "EmpID already exists" });

    const newEmp = new User({
      ...req.body,
      role: "employee",
    });

    await newEmp.save();
    res.status(201).json({ message: "Employee added" });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to add employee", detail: err.message });
  }
});

// Get all employees
router.get("/", async (req, res) => {
  try {
    const emp = await User.find({
      role: { $in: ["employee", "grouphead", "head"] },
    });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: "Failed to get employees" });
  }
});
router.get("/filtered", async (req, res) => {
  try {
    const { role, dept } = req.query;

    if (!role) {
      return res.status(400).json({ error: "Role required" });
    }

    if (role === "admin" || role === "head") {
      // Admin and Head see all users except admin (optional)
      const users = await User.find({ role: { $ne: "admin" } });
      return res.json(users);
    }

    if (!dept) {
      return res
        .status(400)
        .json({ error: "Department required for non-admin/head" });
    }

    // Grouphead and employee see their department only
    const users = await User.find({
      dept: dept.toLowerCase(),
      role: { $ne: "admin" }, // avoid showing admin
    });

    return res.json(users);
  } catch (err) {
    console.error("Filter fetch failed:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
  
  
  

// Search by empid
router.get("/search/id/:empid", async (req, res) => {
  try {
    const emp = await User.findOne({
      empid: req.params.empid,
      role: "employee",
    });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: "Failed to get employee" });
  }
});

// Search by name
router.get("/search/name/:name", async (req, res) => {
  try {
    const emp = await User.findOne({ name: req.params.name, role: "employee" });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: "Failed to get employee" });
  }
});

// Delete employee by empid
router.delete("/delete/:empid", async (req, res) => {
  try {
    const del = await User.deleteOne({
      empid: req.params.empid,
      role: "employee",
    });
    if (del.deletedCount === 0)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete employee" });
  }
});

// Update employee
router.put("/update/:empid", async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { empid: req.params.empid, role: "employee" },
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
