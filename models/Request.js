const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: null,

  },
  description: {
    type: String,
    required: true,
    default: null,

  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null,

  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null,

  },
  technology: {
    type: String,
    required: true,
    default: null,

  },
  type: {
    type: String,
    required: true,
    default: null,

  },
  category: {
    type: String,
    required: true,
    default: null,

  }
});

// STATIC METHODS
RequestSchema.statics.getAllRequests = function () {
  return;
}

// OBJECT METHODS
RequestSchema.methods.getTitle = function () {
  return this.title;
}

RequestSchema.methods.getDescription = function () {
  return this.description;
}

RequestSchema.methods.getCreator = function () {
  return this.creator;
}

RequestSchema.methods.getProject = function () {
  return this.project;
}

RequestSchema.methods.getTechnology = function () {
  return this.technology;
}

RequestSchema.methods.getType = function () {
  return this.type;
}

RequestSchema.methods.getCategory = function () {
  return this.category;
}

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
