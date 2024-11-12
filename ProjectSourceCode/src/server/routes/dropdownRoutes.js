// src/server/routes/dropdownRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../../index');  // Import the db instance from index.js

// Route to get application steps for the dropdown
router.get('/application-steps', async (req, res) => {
    try {
        const applicationSteps = await db.any('SELECT stepID, stepName FROM application_steps');
        res.json(applicationSteps);
    } catch (error) {
        console.error("Failed to fetch application steps:", error);
        res.status(500).json({ error: "Failed to fetch application steps" });
    }
});

module.exports = router;
