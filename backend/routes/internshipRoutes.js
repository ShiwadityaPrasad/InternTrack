
const express = require("express");
const router = express.Router();

const {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship
} = require("../controllers/internshipController");

const authMiddleware = require("../middleware/authMiddleware");

// All internship routes require login
router.use(authMiddleware);

// GET all internships of logged-in user
router.get("/", getInternships);

// Create internship
router.post("/", createInternship);

// Update internship
router.put("/:id", updateInternship);

// Delete internship
router.delete("/:id", deleteInternship);

module.exports = router;
