const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/db");
const todoRoutes = require("./routes/todoRoutes");
const app = express();
const PORT = 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use("/todos", todoRoutes);

// ================= START SERVER =================
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to SQL Server");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
