const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const billRoutes = require("./src/routes/billRoutes");
app.use("/api/bills", billRoutes);

const path = require("path");

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server Running...");
});

const Bill = require("./src/models/bill");

sequelize.sync().then(() => {
  console.log("Database Connected");
  app.listen(3001, () => console.log("Server running on port 3001"));
});

require("./src/cron/reminderJob");

