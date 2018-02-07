const mongoose = require('mongoose');
const Discussion = require('../models/Discussion.js');

const {
  SUCCESS,
  SERVER_ERR,
  USER_ERR
} = require('../variables/statuses.js');

const {
  validateId,
  validateStringInput,
  validateNumberInput,
  validateArrayInput,
  validateObjectInput,
  testAll
} = require('../helpers/validators.js');

const {
  handleLogs,
  handleServerError,
  handleInvalidInput
} = require('../helpers/handlers.js');

const createDiscussion = (req, res) => {
  const {
    title,
    description,
    objectives,
    access,
    visibility,
    tags,
    category
  } = req.body;

  if (testAll(validateStringInput, title, description, objectives, access, visibility, tags, category)) {
    console.log("createDiscussion");
    const newDiscussion = new Discussion({
      title,
      description,
      objectives,
      access,
      visibility,
      tags,
      category,
    });

    newDiscussion.save()
      .then((discussion) => {
        res.json(discussion);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}


const findDiscussions = (req, res) => {
  const mongooseQuery = Discussion.find();

  if (req.body.options.query && typeof req.body.options.query === 'object') {
    mongooseQuery.find(req.body.options.query);
  } else {
    mongooseQuery.find({});
  }

  if (req.body.options.sortBy && typeof req.body.options.sortBy === 'object') {
    mongooseQuery.sort(req.body.options.sortBy);
  }

  if (req.body.options.limit && typeof req.body.options.limit === 'number') {
    mongooseQuery.limit(req.body.options.limit);
  }

  if (req.body.options.select && typeof req.body.options.select === 'string') {
    mongooseQuery.select(req.body.options.select);
  }

  if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
    req.body.options.populate.forEach((options) => {
      const k = Object.keys(options);
      if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
        mongoose.Query.populate(options);
      }
    });
  }

  mongooseQuery.exec()
    .then((discussions) => {
      res.json(discussions);
    })
    .catch((err) => {
      handleServerError(res);
    });
}

module.exports = {
  createDiscussion,
  findDiscussions
}
