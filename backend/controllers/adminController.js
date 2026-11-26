import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

export async function getAllComplaints(req, res) {
  const { status, category, priority, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };

  const complaints = await Complaint.find(filter)
    .populate("student", "name email")
    .sort({ createdAt: -1 });
  res.json({ complaints });
}

export async function updateStatus(req, res) {
  const allowed = ["Pending", "In Progress", "Resolved", "Rejected"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid complaint status" });
  }
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate("student", "name email");

  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json({ message: "Status updated", complaint });
}

export async function updatePriority(req, res) {
  const allowed = ["Low", "Medium", "High"];
  if (!allowed.includes(req.body.priority)) {
    return res.status(400).json({ message: "Invalid priority" });
  }
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { priority: req.body.priority },
    { new: true, runValidators: true }
  );
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json({ message: "Priority updated", complaint });
}

export async function getStats(req, res) {
  const [total, pending, inProgress, resolved, rejected, students] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: "Pending" }),
    Complaint.countDocuments({ status: "In Progress" }),
    Complaint.countDocuments({ status: "Resolved" }),
    Complaint.countDocuments({ status: "Rejected" }),
    User.countDocuments({ role: "student" })
  ]);
  res.json({ stats: { total, pending, inProgress, resolved, rejected, students } });
}

export async function getUsers(req, res) {
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
  res.json({ users });
}
