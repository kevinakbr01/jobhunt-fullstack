require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const pool = require("./config/db");

const authRoutes = require("./routes/authRoute");
const jobRoutes = require("./routes/jobRoute");
const applicationRoutes = require("./routes/applicationRoute");

const errorHandler = require("./middleware/errorHandler");

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "JobHunt API is running",
  });
});

app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("Koneksi MySQL Berhasil!");
    connection.release();

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Koneksi Gagal", error.message);
  }
}

startServer();
