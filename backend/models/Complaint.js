import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  category: {
    type: String,
    required: true,
    enum: ["Hostel", "Classroom", "Wi-Fi", "Electricity", "Water", "Cleanliness", "Library", "Other"]
  },
  imageUrl: { type: String, default: "" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved", "Rejected"], default: "Pending" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
