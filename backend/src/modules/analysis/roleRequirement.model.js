const mongoose = require("mongoose");

const roleRequirementSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },

  requiredSkills: [String],
});

module.exports = mongoose.model(
  "RoleRequirement",
  roleRequirementSchema
);