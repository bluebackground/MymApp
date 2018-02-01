const mongoose = require('mongoose');
const Request = require('../models/Request.js');

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

const createRequest = (req, res) => {
  const {
    title,
    description,
    creator,
    project,
    technology,
    type,
    category
  } = req.body;

  if (testAll(validateStringInput, title, description, technology, type, category) && testAll(validateId, creator, project)) {
    // Commented out for tests.
    const id = new mongoose.Types.ObjectId();
    const newRequest = new Request({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      creator,
      project,
      technology,
      type,
      category
    });

    newRequest.save()
      .then((request) => {
        handleLogs('Created new request', id);
        res.json(request);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readRequests = (req, res) => {

  const mongooseQuery = Request.find();

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
    .then((requests) => {
      res.json(requests);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findRequest = (req, res) => {
  const {
    requestID
  } = req.params;

  if (validateId(requestID)) {

    const mongooseQuery = Request.findById(requestID);

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
      .then((request) => {
        res.json(request);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateRequest = (req, res) => {
  const {
    requestID
  } = req.params;

  const {
    title,
    description,
    creator,
    project,
    technology,
    type,
    category
  } = req.body;

  if (validateId(requestID) && testAll(validateStringInput, title, description, technology, type, category) && testAll(validateId, creator, project)) {
    Request.findByIdAndUpdate(requestID, {
        title,
        description,
        creator,
        project,
        technology,
        type,
        category
      }, {
        new: true
      })
      .exec()
      .then((request) => {
        const id = request._id;
        handleLogs('Updated request properties', id);
        res.json(request);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteRequest = (req, res) => {
  const {
    requestID
  } = req.params;

  if (validateId(requestID)) {
    Request.findByIdAndRemove(requestID)
      .exec()
      .then((request) => {
        const id = request._id;
        handleLogs('Deleted request', id);
        res.json(request);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createRequest,
  readRequests,
  findRequest,
  updateRequest,
  deleteRequest
};
