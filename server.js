const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const PORT = 5050;
const MONGO_URL = "mongodb://admin:qwerty@localhost:27017/mydatabase";

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this if you're testing with Postman or raw JSON
app.use(express.static("public"));

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin", // since you're using username/password
  })
  .then(() => console.log("✅ Mongoose connected"))
  .catch((err) => console.error("❌ Connection error:", err));

// Define a schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

// GET all users
app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).send("Failed to fetch users.");
  }
});

// POST new user
app.post("/addUser", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    console.log("✅ User saved:", user);
    res.status(201).send("User added successfully");
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).send("Failed to save user.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
