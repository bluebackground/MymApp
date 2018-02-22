const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  title: {
  type: String,
  required: true,
},
description: {
  type: String,
  required: true
},
creator: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: "User"  
},
to: {
	type: mongoose.Schema.Types.ObjectId,
	required: true,
	ref: "User"
},
toUsername: {
	type: String,
	required: true
},
confirmations: [{
  type: mongoose.Schema.Types.ObjectId,
  required: false,
  default: [],
  ref: 'User'
}],
project: {
	type: mongoose.Schema.Types.ObjectId,
	required: false,
	ref: "Project",
	default: null
},
technology: {
  type: String,
  required: false,
  default: ""  
},
type: {
  type: String,
  required: false,
  default: ''
},
category: {
  type: String,
  required: false,
  default: ''
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