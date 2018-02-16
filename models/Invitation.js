const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    default: null,
  },
  description: {
    type: String,
    required: false,
    default: 'You are invited to join this project',
  },
  role: {
    type: String,
    required: false,
    default: null,
  },
  status: {
    type: String,
    required: false,
    default: 'unaccepted'
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  }
});

// STATIC METHODS
InvitationSchema.statics.getAllInvitations = function () {
  return;
}

// OBJECT METHODS
InvitationSchema.methods.getTitle = function () {
  return this.title;
}

InvitationSchema.methods.getDescription = function () {
  return this.description;
}

InvitationSchema.methods.getRole = function () {
  return this.role;
}

InvitationSchema.methods.getFrom = function () {
  return this.from;
}

InvitationSchema.methods.getTo = function () {
  return this.to;
}

InvitationSchema.methods.getProject = function () {
  return this.project;
}

const Invitation = mongoose.model('Invitation', InvitationSchema);

module.exports = Invitation;
