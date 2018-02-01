const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
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
  type: [mongoose.Schema.Types.ObjectId],
  required: false,
  default: [],
  ref: 'collectionName'
},
choices: {
  type: Array,
  required: false,
  default: [],
  
},
votes: {
  type: [mongoose.Schema.Types.ObjectId],
  required: false,
  default: [],
  ref: 'collectionName'
}
});

// STATIC METHODS
PollSchema.statics.getAllPolls = function () {
  return;
}

// OBJECT METHODS
PollSchema.methods.getTitle = function () {
  return this.title;
}

PollSchema.methods.getDescription = function () {
  return this.description;
}

PollSchema.methods.getCreator = function () {
  return this.creator;
}

PollSchema.methods.getChoices = function () {
  return this.choices;
}

PollSchema.methods.getVotes = function () {
  return this.votes;
}

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;