
const Internship = require("../models/Internship");

// GET: Sirf logged-in user ki internships fetch karna
async function getInternships(req, res) {
  try {
    const internships = await Internship.find({
      user: req.user.userId
    });

    res.json({
      success: true,
      data: internships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// POST: Logged-in user ke liye internship create karna
async function createInternship(req, res) {
  try {
    const {
      company,
      role,
      location,
      status,
      deadline,
      notes,
      applicationLink
    } = req.body;

    if (!company?.trim() || !role?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required"
      });
    }

    const newInternship = await Internship.create({
      company: company.trim(),
      role: role.trim(),
      location,
      status,
      deadline: deadline || null,
      notes,
      applicationLink,

      // Automatically attach logged-in user
      user: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: "Internship added successfully",
      data: newInternship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// PUT: Sirf apni internship update karna
async function updateInternship(req, res) {
  try {
    const {
      company,
      role,
      location,
      status,
      deadline,
      notes,
      applicationLink
    } = req.body;

    const updatedInternship =
      await Internship.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId
        },
        {
          company,
          role,
          location,
          status,
          deadline: deadline || null,
          notes,
          applicationLink
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedInternship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    res.json({
      success: true,
      message: "Internship updated successfully",
      data: updatedInternship
    });
  } catch (error) {
    const statusCode =
      error.name === "CastError" ||
      error.name === "ValidationError"
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

// DELETE: Sirf apni internship delete karna
async function deleteInternship(req, res) {
  try {
    const deletedInternship =
      await Internship.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId
      });

    if (!deletedInternship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    res.json({
      success: true,
      message: "Internship deleted successfully"
    });
  } catch (error) {
    const statusCode =
      error.name === "CastError" ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship
};
