const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: {
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
priority: {
  type: Number,
  required: true,
  default: null,
  
}
});

// STATIC METHODS
MessageSchema.statics.getAllMessages = function () {
  return;
}

// OBJECT METHODS
MessageSchema.methods.getText = function () {
  return this.text;
}

MessageSchema.methods.getFrom = function () {
  return this.from;
}

MessageSchema.methods.getTo = function () {
  return this.to;
}

MessageSchema.methods.getPriority = function () {
  return this.priority;
}

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;