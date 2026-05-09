import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: String,
  role: {
    type: String,
    enum: ["admin", "faculty", "student"],
    default: "student"
  },
  department: String,
  rollNo: String,
  designation: String
});

export default mongoose.model("User", userSchema);
