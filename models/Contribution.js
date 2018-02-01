const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
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
comfirmations: {
  type: [mongoose.Schema.Types.ObjectId],
  required: false,
  default: [],
  ref: 'collectionName'
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
ContributionSchema.statics.getAllContributions = function () {
  return;
}

// OBJECT METHODS
ContributionSchema.methods.getTitle = function () {
  return this.title;
}

ContributionSchema.methods.getDescription = function () {
  return this.description;
}

ContributionSchema.methods.getCreator = function () {
  return this.creator;
}

ContributionSchema.methods.getComfirmations = function () {
  return this.comfirmations;
}

ContributionSchema.methods.getTechnology = function () {
  return this.technology;
}

ContributionSchema.methods.getType = function () {
  return this.type;
}

ContributionSchema.methods.getCategory = function () {
  return this.category;
}

const Contribution = mongoose.model('Contribution', ContributionSchema);

module.exports = Contribution;