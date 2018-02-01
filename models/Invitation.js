const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
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
role: {
  type: String,
  required: true,
  default: null,
  
},
from: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  default: null,
  
},
to: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  default: null,
  
},
project: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  default: null,
  
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