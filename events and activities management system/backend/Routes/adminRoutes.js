import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Event from "../models/Event.js";

const router = express.Router();

// ================================
// ADMIN AUTH MIDDLEWARE
// ================================
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admin access only" });

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================================
// ADMIN PROFILE
// ================================
router.get("/profile", verifyAdmin, async (req, res) => {
  try {
    const admin = await User.findById(req.admin.id).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Profile error" });
  }
});

// ================================
// GET ALL EVENTS
// ================================
router.get("/events", verifyAdmin, async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizerId", "name email");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

// ================================
// APPROVE EVENT
// ================================
router.put("/event/approve/:id", verifyAdmin, async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, {
      status: "approved"
    });

    res.json({ message: "Event approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

// ================================
// REJECT EVENT
// ================================
router.put("/event/reject/:id", verifyAdmin, async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, {
      status: "rejected"
    });

    res.json({ message: "Event rejected" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
});

// ================================
// GET ALL USERS
// ================================
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["student", "faculty"] }
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ================================
// DELETE USER
// ================================
router.delete("/user/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
