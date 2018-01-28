const {
  STATUS_USER_ERROR,
  STATUS_SERVER_ERROR,
  STATUS_OK
} = require('../variables/statuses.js');

const mongoose = require('mongoose');

function validateStringInput(str) {
  if (str === undefined) return false;
  if (typeof str !== 'string') return false;
  return true;
}

function validateNumberInput(num) {
  if (num === undefined) return false;
  if (typeof num !== 'number') return false;
  return true;
}

function validateObjectInput(obj) {
  if (obj === undefined) return false;
  if (typeof obj !== 'object') return false;
  return true;
}

function validateArrayInput(arr) {
  return Array.isArray(arr);
}

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function testAll(callback) {
  const func = arguments[0];
  const values = arguments;
  for (let i = 1; i < values.length; i++) {
    if (!func(values[i])) return false;
  }
  return true;
}

module.exports = {
  validateStringInput,
  validateNumberInput,
  validateObjectInput,
  validateArrayInput,
  validateId,
  testAll
}
