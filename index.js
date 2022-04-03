// Modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Mongo Connection

mongoose
  .connect("mongodb://localhost/Vehicle-Management-System")
  .then(() => console.log("Connected to Mongo DB"))
  .catch(() => console.log("Could not connect to Mongo DB"));

// Env Configuration
dotenv.config();

// Port Configuration
const port = process.env.PORT || 5050;

// Router Imports

// Initailaising App
const app = express();
// Cors Policy
app.use(
  cors({
    origin: "*",
  })
);

// Middleware
app.use(express.json());

// Routes

// Listener
app.listen(port, () => console.log(`Listening on port ${port}`));