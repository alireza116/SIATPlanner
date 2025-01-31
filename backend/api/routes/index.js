const express = require("express");
const router = express.Router();

const issuesRoutes = require("./issues");
const swotEntriesRoutes = require("./swot-entries");
const goalsRoutes = require("./goals");
const actionsRoutes = require("./actions");
const actionSwotRelationsRoutes = require("./action-swot-relations");

router.use("/issues", issuesRoutes);
router.use("/swot-entries", swotEntriesRoutes);
router.use("/goals", goalsRoutes);
router.use("/actions", actionsRoutes);
router.use("/action-swot-relations", actionSwotRelationsRoutes);

module.exports = router;
