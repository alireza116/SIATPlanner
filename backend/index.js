require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./api/routes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*", // More permissive for development
    credentials: true,
  })
);
console.log(process.env);

// Construct MongoDB URI
let MONGO_URI;
if (process.env.MONGO_URI) {
  // Use the full URI if provided
  MONGO_URI = process.env.MONGO_URI;
} else if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
  // Construct URI from username and password
  MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@siat.15hko.mongodb.net/?retryWrites=true&w=majority&appName=siat`;
} else {
  console.error("No MongoDB credentials provided!");
  process.exit(1);
}

// Log connection attempt (sanitized)
console.log("MongoDB connection details:");
console.log("Using full URI:", !!process.env.MONGO_URI);
console.log(
  "Using username/password:",
  !process.env.MONGO_URI && !!process.env.MONGO_USERNAME
);
console.log(
  "URI starts with:",
  MONGO_URI.substring(0, MONGO_URI.indexOf("://") + 6)
);

const PORT = process.env.PORT || 8080;

// MongoDB Connection with better error handling
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connected successfully");

    // Only start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if we can't connect to the database
  });

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "API is working" });
});

app.use("/api", routes);
