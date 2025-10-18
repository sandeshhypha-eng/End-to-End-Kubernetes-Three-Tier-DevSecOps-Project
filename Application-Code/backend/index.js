const tasks = require("./routes/tasks");
const connectWithRetry = require("./db");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
let isDbConnected = false;

// Connect to MongoDB before starting server
(async () => {
  try {
    await connectWithRetry();
    isDbConnected = true;
  } catch (err) {
    console.error("MongoDB initial connection failed:", err.message);
  }

  const port = process.env.PORT || 3500;
  app.listen(port, () => console.log(`Listening on port ${port}...`));
})();

app.use(express.json());
app.use(cors());

// Basic health check
app.get("/healthz", (req, res) => {
  res.status(200).send("Healthy");
});

// Readiness probe: only ready if DB is connected
app.get("/ready", (req, res) => {
  if (mongoose.connection.readyState === 1 && isDbConnected) {
    res.status(200).send("Ready");
  } else {
    console.log(`Database readyState: ${mongoose.connection.readyState}`);
    res.status(503).send("Not Ready");
  }
});

// Startup check
app.get("/started", (req, res) => {
  res.status(200).send("Started");
});

// API routes
app.use("/api/tasks", tasks);
