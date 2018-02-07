const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'untitled'
  },
  description: {
    type: String,
    required: true,
    default: ''
  },
  objectives: {
    type: String,
    required: true,
    default: '',
  },
  visibility: {
    type: String,
    required: true,
    default: 'visible'
  },
  access: {
    type: String,
    required: true,
    default: 'public'
  },
  category: {
    type: String,
    required: true,
    default: ''
  },
  tags: {
    type: String,
    required: true,
    default: ''
  }
});

// STATIC METHODS
DiscussionSchema.statics.getAllDiscussions = function () {
  return;
}

// OBJECT methods
DiscussionSchema.methods.getTitle = function () {
  return this.title;
}

const Discussion = mongoose.model('Discussion', DiscussionSchema);

module.exports = Discussion;
