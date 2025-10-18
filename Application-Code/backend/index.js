const tasks = require("./routes/tasks");
const connectWithRetry = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

let isDbConnected = false;

// Connect to MongoDB
(async () => {
  try {
    await connectWithRetry();
    isDbConnected = true;
  } catch (err) {
    console.error("MongoDB initial connection failed:", err.message);
  }

  // Listen only after attempting DB connection
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
    res.status(503).send("Not Ready");
  }
});

// Startup check
app.get("/started", (req, res) => {
  res.status(200).send("Started");
});

app.use("/api/tasks", tasks);
