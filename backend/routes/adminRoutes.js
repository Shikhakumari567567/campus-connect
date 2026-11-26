import { Router } from "express";
import {
  getAllComplaints, updateStatus, updatePriority, getStats, getUsers
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();
router.use(protect, adminOnly);
router.get("/complaints", getAllComplaints);
router.patch("/complaints/:id/status", updateStatus);
router.patch("/complaints/:id/priority", updatePriority);
router.get("/stats", getStats);
router.get("/users", getUsers);
export default router;
