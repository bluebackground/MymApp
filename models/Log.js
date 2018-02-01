const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  message: String,
  referenceID: mongoose.Schema.Types.ObjectId
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;