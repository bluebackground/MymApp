const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
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
fset: {
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
FeatureSchema.statics.getAllFeatures = function () {
  return;
}

// OBJECT METHODS
FeatureSchema.methods.getTitle = function () {
  return this.title;
}

FeatureSchema.methods.getDescription = function () {
  return this.description;
}

FeatureSchema.methods.getCreator = function () {
  return this.creator;
}

FeatureSchema.methods.getProject = function () {
  return this.project;
}

FeatureSchema.methods.getFset = function () {
  return this.fset;
}

FeatureSchema.methods.getType = function () {
  return this.type;
}

FeatureSchema.methods.getCategory = function () {
  return this.category;
}

const Feature = mongoose.model('Feature', FeatureSchema);

module.exports = Feature;