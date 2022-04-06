// Modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Mongo Connection

mongoose
  .connect("mongodb://localhost/Pic-Sharing")
  .then(() => console.log("Connected to Mongo DB"))
  .catch(() => console.log("Could not connect to Mongo DB"));

// Env Configuration
dotenv.config();

// Port Configuration
const port = process.env.PORT || 5000;

// Router Imports
const signup = require("./routes/signup");
const login = require("./routes/login");
const updateProfile = require("./routes/updateProfile");

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
app.use("/users", signup, login, updateProfile);

// Listener
app.listen(port, () => console.log(`Listening on port ${port}`));
