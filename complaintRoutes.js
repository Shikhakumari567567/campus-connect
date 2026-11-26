import { Router } from "express";
import {
  createComplaint, getMyComplaints, getComplaintById,
  updateMyComplaint, deleteMyComplaint
} from "../controllers/complaintController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.use(protect);
router.post("/", upload.single("image"), createComplaint);
router.get("/my", getMyComplaints);
router.get("/:id", getComplaintById);
router.put("/:id", updateMyComplaint);
router.delete("/:id", deleteMyComplaint);
export default router;
