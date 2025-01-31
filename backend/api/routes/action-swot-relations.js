const express = require("express");
const router = express.Router();
const { ActionSwotRelation } = require("../models");

// Get all relations
router.get("/", async (req, res) => {
  try {
    const relations = await ActionSwotRelation.find();
    res.json(relations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get relations by action
router.get("/action/:actionId", async (req, res) => {
  try {
    const relations = await ActionSwotRelation.find({
      actionId: req.params.actionId,
    });
    res.json(relations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get relations by SWOT entry
router.get("/swot/:swotId", async (req, res) => {
  try {
    const relations = await ActionSwotRelation.find({
      swotId: req.params.swotId,
    });
    res.json(relations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create relation
router.post("/", async (req, res) => {
  const relation = new ActionSwotRelation(req.body);
  try {
    const newRelation = await relation.save();
    res.status(201).json(newRelation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete relation
router.delete("/:id", async (req, res) => {
  try {
    const relation = await ActionSwotRelation.findByIdAndDelete(req.params.id);
    if (!relation)
      return res.status(404).json({ message: "Relation not found" });
    res.json({ message: "Relation deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
