const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
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
priority: {
  type: Number,
  required: true,
  default: null,
  
},
votes: {
  type: [mongoose.Schema.Types.ObjectId],
  required: false,
  default: [],
  ref: 'collectionName'
}
});

// STATIC METHODS
StorySchema.statics.getAllStorys = function () {
  return;
}

// OBJECT METHODS
StorySchema.methods.getTitle = function () {
  return this.title;
}

StorySchema.methods.getDescription = function () {
  return this.description;
}

StorySchema.methods.getCreator = function () {
  return this.creator;
}

StorySchema.methods.getProject = function () {
  return this.project;
}

StorySchema.methods.getPriority = function () {
  return this.priority;
}

StorySchema.methods.getVotes = function () {
  return this.votes;
}

const Story = mongoose.model('Story', StorySchema);

module.exports = Story;