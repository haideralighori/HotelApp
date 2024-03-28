const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./route");
const cors = require("cors");
const connectDB = require("./connect");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Routes
app.use("/api", route);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// MongoDB connection testing
const start = async () => {
  try {
    await connectDB(
      "mongodb+srv://alighori267:I6WiKi3uzox6M8bY@cluster0.eqio5j0.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

start();
