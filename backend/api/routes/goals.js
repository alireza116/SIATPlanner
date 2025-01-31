const express = require("express");
const router = express.Router();
const { Goal } = require("../models");

// Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get goals by issue
router.get("/issue/:issueId", async (req, res) => {
  try {
    const goals = await Goal.find({ issueId: req.params.issueId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single goal
router.get("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create goal
router.post("/", async (req, res) => {
  const goal = new Goal(req.body);
  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update goal
router.put("/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete goal
router.delete("/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
