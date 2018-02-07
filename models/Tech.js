const mongoose = require('mongoose');

const TechSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: null

  },
  description: {
    type: String,
    required: true,
    default: null

  },
  source: {
    type: String,
    required: true,
    default: null
  },
  type: {
    type: String,
    required: true,
    default: null

  },
  category: {
    type: String,
    required: true,
    default: null
  },
  tags: {
    type: String,
    required: true,
    default: null
  }
});

// STATIC METHODS
TechSchema.statics.getAllTechs = function () {
  return;
}

// OBJECT METHODS
TechSchema.methods.getName = function () {
  return this.name;
}

TechSchema.methods.getDescription = function () {
  return this.description;
}

TechSchema.methods.getType = function () {
  return this.type;
}

TechSchema.methods.getCategory = function () {
  return this.category;
}

const Tech = mongoose.model('Tech', TechSchema);

module.exports = Tech;
