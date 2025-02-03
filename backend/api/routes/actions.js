const express = require("express");
const router = express.Router();
const { Action } = require("../models");

// Get all actions
router.get("/", async (req, res) => {
  try {
    const actions = await Action.find();
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get actions by issue
router.get("/issue/:issueId", async (req, res) => {
  try {
    const actions = await Action.find({ issueId: req.params.issueId })
      .populate("swotEntries")
      .exec();
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single action
router.get("/:id", async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) return res.status(404).json({ message: "Action not found" });
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create action
router.post("/", async (req, res) => {
  const action = new Action(req.body);
  try {
    const newAction = await action.save();
    res.status(201).json(newAction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update action (only title and description)
router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const action = await Action.findById(req.params.id);

    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    // Only update title and description
    action.title = title;
    action.description = description;
    await action.save();

    res.json(action);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete action
router.delete("/:id", async (req, res) => {
  try {
    const action = await Action.findByIdAndDelete(req.params.id);
    if (!action) return res.status(404).json({ message: "Action not found" });
    res.json({ message: "Action deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add SWOT entry to action
router.post("/:id/swot-entries", async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    const { swotEntryId } = req.body;
    if (!action.swotEntries.includes(swotEntryId)) {
      action.swotEntries.push(swotEntryId);
      await action.save();
    }

    const populatedAction = await Action.findById(action._id)
      .populate("swotEntries")
      .exec();

    res.json(populatedAction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove SWOT entry from action
router.delete("/:id/swot-entries/:swotEntryId", async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    action.swotEntries = action.swotEntries.filter(
      (id) => id.toString() !== req.params.swotEntryId
    );
    await action.save();

    const populatedAction = await Action.findById(action._id)
      .populate("swotEntries")
      .exec();

    res.json(populatedAction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get action detail
router.get("/:id/detail", async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }
    res.json({ detail: action.detail || "" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add or update action detail
router.put("/:id/detail", async (req, res) => {
  try {
    const { detail } = req.body;
    const action = await Action.findById(req.params.id);

    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    action.detail = detail;
    await action.save();

    res.json(action);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove action detail
router.delete("/:id/detail", async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);

    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    action.detail = ""; // Clear the detail field
    await action.save();

    res.json(action);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
