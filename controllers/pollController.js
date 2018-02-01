const mongoose = require('mongoose');
const Poll = require('../models/Poll.js');

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

const createPoll = (req, res) => {
  const {
    title,
    description,
    creator,
    choices,
    votes
  } = req.body;

  if (testAll(validateStringInput, title, description) && testAll(validateArrayInput, creator, choices, votes)) {
    // Commented out for tests.
    const id = new mongoose.Types.ObjectId();
    const newPoll = new Poll({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      creator,
      choices,
      votes
    });

    newPoll.save()
      .then((poll) => {
        handleLogs('Created new poll', id);
        res.json(poll);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readPolls = (req, res) => {

  const mongooseQuery = Poll.find();

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
    .then((polls) => {
      res.json(polls);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findPoll = (req, res) => {
  const {
    pollID
  } = req.params;

  if (validateId(pollID)) {

    const mongooseQuery = Poll.findById(pollID);

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
      .then((poll) => {
        res.json(poll);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updatePoll = (req, res) => {
  const {
    pollID
  } = req.params;

  const {
    title,
    description,
    creator,
    choices,
    votes
  } = req.body;

  if (validateId(pollID) && testAll(validateStringInput, title, description) && testAll(validateArrayInput, creator, choices, votes)) {
    Poll.findByIdAndUpdate(pollID, {
        title,
        description,
        creator,
        choices,
        votes
      }, {
        new: true
      })
      .exec()
      .then((poll) => {
        const id = poll._id;
        handleLogs('Updated poll properties', id);
        res.json(poll);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deletePoll = (req, res) => {
  const {
    pollID
  } = req.params;

  if (validateId(pollID)) {
    Poll.findByIdAndRemove(pollID)
      .exec()
      .then((poll) => {
        const id = poll._id;
        handleLogs('Deleted poll', id);
        res.json(poll);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createPoll,
  readPolls,
  findPoll,
  updatePoll,
  deletePoll
};
