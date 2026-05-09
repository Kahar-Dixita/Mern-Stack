import express from "express";
import jwt from "jsonwebtoken";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";

const router = express.Router();

// ==============================
// HELPER FUNCTION
// ==============================
const getDecodedUser = (req) => {
  if (!req.headers.authorization) return null;

  const token = req.headers.authorization.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ==============================
// STUDENT PROFILE
// ==============================
router.get("/profile", async (req, res) => {
  try {
    const decoded = getDecodedUser(req);

    if (!decoded || decoded.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await User.findById(decoded.id).select("-password");

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch profile" });
  }
});

// ==============================
// GET ALL APPROVED EVENTS
// ==============================
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// REGISTER FOR EVENT
// ==============================
router.post("/register/:eventId", async (req, res) => {
  try {
    const decoded = getDecodedUser(req);

    if (!decoded || decoded.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const already = await Registration.findOne({
      eventId: req.params.eventId,
      studentId: decoded.id,
    });

    if (already) {
      return res.json({ message: "Already registered" });
    }

    const registration = new Registration({
      eventId: req.params.eventId,
      studentId: decoded.id,
    });

    await registration.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// ==============================
// MY REGISTERED EVENTS
// ==============================
router.get("/my-events", async (req, res) => {
  try {
    const decoded = getDecodedUser(req);

    if (!decoded || decoded.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const registrations = await Registration.find({
      studentId: decoded.id
    }).populate("eventId");

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

// ==============================
// SEARCH + FILTER EVENTS
// ==============================
router.get("/search-events", async (req, res) => {
  try {
    const { search, venue, date } = req.query;

    let query = { status: "approved" };

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by venue
    if (venue) {
      query.venue = venue;
    }

    // Filter by date
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = {
        $gte: start,
        $lte: end
      };
    }

    const events = await Event.find(query);

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
