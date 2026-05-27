const express = require('express');
const router = express.Router();

/**
 * Minimal contacts router stub to ensure server runs successfully
 * during early TDD commits.
 */
router.get('/', (req, res) => {
  res.status(200).json([]);
});

// Test helper to allow E2E state reset
router.post('/clear', (req, res) => {
  res.status(200).json({ message: "Cleared" });
});

module.exports = router;
