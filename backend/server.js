import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "http://localhost:5173",
    credentials: true,
  })
);

// Limit ko 5mb kiya gaya hai taaki image/form data fail na ho
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.get("/api/health", (_req, res) => res.json({ message: "Campus Connect API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error("Global Error Handler:", err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 5 MB or smaller" });
  }
  return res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Server ko achanak crash (502) hone se bachane ke liye
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();

    if (process.env.ADMIN_EMAIL) {
      const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
      const admin = await User.findOne({ email });
      if (admin && admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log(`Promoted ${email} to admin`);
      }
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

start();






























