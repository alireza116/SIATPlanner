const express = require("express");
const router = express.Router();
const { SwotEntry } = require("../models");

// Get all SWOT entries
router.get("/", async (req, res) => {
  try {
    const entries = await SwotEntry.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get SWOT entries by issue
router.get("/issue/:issueId", async (req, res) => {
  try {
    const entries = await SwotEntry.find({ issueId: req.params.issueId });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single SWOT entry
router.get("/:id", async (req, res) => {
  try {
    const entry = await SwotEntry.findById(req.params.id);
    if (!entry)
      return res.status(404).json({ message: "SWOT entry not found" });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create SWOT entry
router.post("/", async (req, res) => {
  const entry = new SwotEntry(req.body);
  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update SWOT entry
router.put("/:id", async (req, res) => {
  try {
    console.log("Update request:", {
      params: req.params,
      body: req.body,
    });

    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const entry = await SwotEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "SWOT entry not found" });
    }

    // Only update description
    entry.description = description;
    await entry.save();

    console.log("Updated entry:", entry);
    res.json(entry);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete SWOT entry
router.delete("/:id", async (req, res) => {
  try {
    const entry = await SwotEntry.findByIdAndDelete(req.params.id);
    if (!entry)
      return res.status(404).json({ message: "SWOT entry not found" });
    res.json({ message: "SWOT entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
