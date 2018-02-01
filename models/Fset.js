const mongoose = require('mongoose');

const FsetSchema = new mongoose.Schema({
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
FsetSchema.statics.getAllFsets = function () {
  return;
}

// OBJECT METHODS
FsetSchema.methods.getTitle = function () {
  return this.title;
}

FsetSchema.methods.getDescription = function () {
  return this.description;
}

FsetSchema.methods.getCreator = function () {
  return this.creator;
}

FsetSchema.methods.getProject = function () {
  return this.project;
}

FsetSchema.methods.getType = function () {
  return this.type;
}

FsetSchema.methods.getCategory = function () {
  return this.category;
}

const Fset = mongoose.model('Fset', FsetSchema);

module.exports = Fset;