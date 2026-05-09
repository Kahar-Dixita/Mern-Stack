import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  venue: String,
  capacity: Number,
  status: {
    type: String,
    default: "pending",
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Event", eventSchema);

