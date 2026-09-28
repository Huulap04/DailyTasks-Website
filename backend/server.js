const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { connectDB } = require("./db/db");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const { sendError } = require("./utils/http");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const createRateLimiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => sendError(res, 429, "RATE_LIMITED", message),
  });

const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  10,
  "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút."
);
const todoLimiter = createRateLimiter(
  15 * 60 * 1000,
  300,
  "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau."
);

function validateEnvironment() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }
}

// ================= MIDDLEWARE =================
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin(origin, callback) {
      // Requests from tools such as curl do not include an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "10kb" }));

app.use("/todos", todoLimiter, verifyToken, todoRoutes);
app.use("/auth", authLimiter, authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Không tìm thấy endpoint.",
    error: { code: "ROUTE_NOT_FOUND", message: "Không tìm thấy endpoint." },
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled request error:", err.message);
  const isCorsError = err.message === "Origin is not allowed by CORS";
  const isPayloadTooLarge = err.type === "entity.too.large";
  res.status(isCorsError ? 403 : isPayloadTooLarge ? 413 : 500).json({
    message: isCorsError
      ? "Origin không được phép."
      : isPayloadTooLarge
        ? "Dữ liệu gửi lên vượt quá giới hạn 10kb."
        : "Đã có lỗi xảy ra.",
    error: {
      code: isCorsError ? "CORS_NOT_ALLOWED" : isPayloadTooLarge ? "PAYLOAD_TOO_LARGE" : "INTERNAL_ERROR",
    },
  });
});

// ================= START SERVER =================
const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();
    console.log("Connected to Supabase PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
