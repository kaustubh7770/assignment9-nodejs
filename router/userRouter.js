const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");

const router = express.Router();
const allowedFields = ["name", "email", "age", "course"];

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json({
      message: "User added successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid user data",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    console.error("Error adding user:", error.message);
    return res.status(500).json({ message: "Unable to add user" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    return res.status(500).json({ message: "Unable to retrieve users" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    return res.status(500).json({ message: "Unable to retrieve user" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: "Invalid request data",
      invalidFields,
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid user data",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.error("Error updating user:", error.message);
    return res.status(500).json({ message: "Unable to update user" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(500).json({ message: "Unable to delete user" });
  }
});

module.exports = router;
