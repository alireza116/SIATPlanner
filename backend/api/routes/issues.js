const express = require("express");
const router = express.Router();
const { Issue } = require("../models");

// Get all issues
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single issue
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create issue
router.post("/", async (req, res) => {
  const issue = new Issue(req.body);
  try {
    const newIssue = await issue.save();
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update issue
router.put("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete issue
router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json({ message: "Issue deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
