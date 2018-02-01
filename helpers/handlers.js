const mongoose = require('mongoose');

const {
  SERVER_ERR,
  USER_ERR,
  SUCCESS
} = require('../variables/statuses.js');

const Log = require('../models/Log.js');

function handleInvalidInput(res) {
  const message = {
    message: 'Invalid Input'
  };
  res.status(USER_ERR);
  // res.send(JSON.stringify(message, undefined, 2));
  res.json(message);
}

function handleServerError(res, err) {
  const error = {
    stack: err.stack,
    message: err.message
  };
  res.status(SERVER_ERR);
  // res.send(JSON.stringify(message, undefined, 2));
  res.json(error);
}

function handleLogs(message, id) {
  const newLog = new Log({
    message,
    referenceID: id
  });
  newLog.save()
    .then()
    .catch();
}

module.exports = {
  handleServerError,
  handleInvalidInput,
  handleLogs,
}
