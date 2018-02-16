const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    default: null,

  },
  description: {
    type: String,
    required: true,
    default: null,

  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null,
    ref: 'User'
  },
  discussion: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null,
    ref: 'Discussion'
  }
});

// STATIC METHODS
CommentSchema.statics.getAllComments = function () {
  return;
}

// OBJECT METHODS
CommentSchema.methods.getTitle = function () {
  return this.title;
}

CommentSchema.methods.getDescription = function () {
  return this.description;
}

CommentSchema.methods.getFrom = function () {
  return this.from;
}

CommentSchema.methods.getProject = function () {
  return this.project;
}

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
