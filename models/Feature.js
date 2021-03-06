const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Project"
	},
// fset: {
//   type: mongoose.Schema.Types.ObjectId,
//   required: false,
//   default: null,
// },
	tasks: {
		type: String,
		required: false,
		default: ''
	},
	type: {
		type: String,
		required: false,
		default: ''
	},
	category: {
		type: String,
		required: true,
	},
	upvotes: [{
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		default: [],
		ref: "User"
	}]
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