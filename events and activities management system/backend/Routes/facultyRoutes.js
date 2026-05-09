import express from "express";
import jwt from "jsonwebtoken";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

const router = express.Router();

// ========================
// AUTH HELPER
// ========================
const getDecodedUser = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2) return null;

    return jwt.verify(parts[1], process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// ========================
// DATE VALIDATION HELPER
// ========================
const isPastDate = (date) => {
  const today = new Date().toISOString().split("T")[0];
  return !date || date < today;
};

// ========================
// CREATE EVENT
// ========================
router.post("/create", async (req, res) => {
  try {
    const decoded = getDecodedUser(req);

    if (!decoded || decoded.role !== "faculty") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (isPastDate(req.body.date)) {
      return res.status(400).json({
        message: "Past date not allowed"
      });
    }

    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      venue: req.body.venue,
      capacity: req.body.capacity,
      organizerId: decoded.id,
      status: "pending"
    });

    await event.save();

    res.json({ message: "Event created successfully" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ========================
// VIEW MY EVENTS
// ========================
router.get("/my-events", async (req, res) => {
  try {
    const decoded = getDecodedUser(req);

    if (!decoded || decoded.role !== "faculty") {
      return res.status(403).json({ message: "Access denied" });
    }

    const events = await Event.find({ organizerId: decoded.id });
    res.json(events);

  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ========================
// UPDATE EVENT
// ========================
router.put("/update/:id", async (req, res) => {
  try {
    const decoded = getDecodedUser(req);

    if (!decoded || decoded.role !== "faculty") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (isPastDate(req.body.date)) {
      return res.status(400).json({
        message: "Past date not allowed"
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.status !== "pending")
      return res.status(400).json({ message: "Cannot edit approved event" });

    Object.assign(event, req.body);
    await event.save();

    res.json({ message: "Event updated successfully" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ========================
// VIEW REGISTERED STUDENTS
// ========================
router.get("/students/:eventId", async (req, res) => {
  try {
    const decoded = getDecodedUser(req);

    if (!decoded || decoded.role !== "faculty") {
      return res.status(403).json({ message: "Access denied" });
    }

    const event = await Event.findById(req.params.eventId);

    if (!event || event.status !== "approved") {
      return res.status(400).json({ message: "Event not approved" });
    }

    const registrations = await Registration.find({
      eventId: req.params.eventId
    }).populate("studentId", "name roll department year");

    res.json(registrations.map(r => r.studentId));

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
