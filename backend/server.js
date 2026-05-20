const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/db");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

app.use("/todos", verifyToken, todoRoutes);
app.use("/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// ================= START SERVER =================
const startServer = async () => {
  try {
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