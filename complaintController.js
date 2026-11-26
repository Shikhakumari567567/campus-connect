import cloudinary from "../config/cloudinary.js";
import Complaint from "../models/Complaint.js";

const categories = ["Hostel", "Classroom", "Wi-Fi", "Electricity", "Water", "Cleanliness", "Library", "Other"];

export async function createComplaint(req, res) {
  try {
    const { title, description, category, priority } = req.body;
    if (!title?.trim() || !description?.trim() || !category) {
      return res.status(400).json({ message: "Title, description and category are required" });
    }
    if (!categories.includes(category)) return res.status(400).json({ message: "Invalid category" });

    let imageUrl = "";
    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(503).json({ message: "Image storage is not configured" });
      }
      let uploaded;
      try {
        uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "campus-connect/complaints", resource_type: "image" },
            (error, result) => error ? reject(error) : resolve(result)
          );
          stream.end(req.file.buffer);
        });
      } catch (error) {
        console.error("Cloudinary complaint image upload failed:", error);
        return res.status(502).json({
          message: "Image upload failed. Check Cloudinary credentials or remove the image and try again."
        });
      }
      imageUrl = uploaded.secure_url;
    }

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category,
      priority: ["Low", "Medium", "High"].includes(priority) ? priority : "Medium",
      imageUrl,
      student: req.user._id
    });
    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (error) {
    console.error("Could not submit complaint:", error);
    res.status(500).json({ message: "Could not submit complaint" });
  }
}

export async function getMyComplaints(req, res) {
  const complaints = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json({ complaints });
}

export async function getComplaintById(req, res) {
  const complaint = await Complaint.findById(req.params.id).populate("student", "name email");
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  const ownerId = complaint.student._id.toString();
  if (req.user.role !== "admin" && ownerId !== req.user._id.toString()) {
    return res.status(403).json({ message: "You cannot view this complaint" });
  }
  res.json({ complaint });
}

export async function updateMyComplaint(req, res) {
  const complaint = await Complaint.findOne({ _id: req.params.id, student: req.user._id });
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  if (complaint.status !== "Pending") {
    return res.status(400).json({ message: "Only pending complaints can be edited" });
  }
  const { title, description, category } = req.body;
  if (title !== undefined) complaint.title = title.trim();
  if (description !== undefined) complaint.description = description.trim();
  if (category !== undefined && categories.includes(category)) complaint.category = category;
  await complaint.save();
  res.json({ message: "Complaint updated", complaint });
}

export async function deleteMyComplaint(req, res) {
  const complaint = await Complaint.findOne({ _id: req.params.id, student: req.user._id });
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  if (complaint.status !== "Pending") {
    return res.status(400).json({ message: "Only pending complaints can be deleted" });
  }
  await complaint.deleteOne();
  res.json({ message: "Complaint deleted" });
}
