const mongoose = require('mongoose');
const Fset = require('../models/Fset.js');

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

const createFset = (req, res) => {
  const {
    title,
    description,
    creator,
    project,
    type,
    category
  } = req.body;

  if (testAll(validateStringInput, title, description, type, category) && testAll(validateId, creator, project)) {
    // Commented out for tests.
    const id = new mongoose.Types.ObjectId();
    const newFset = new Fset({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      creator,
      project,
      type,
      category
    });

    newFset.save()
      .then((fset) => {
        handleLogs('Created new fset', id);
        res.json(fset);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readFsets = (req, res) => {

  const mongooseQuery = Fset.find();

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
    .then((fsets) => {
      res.json(fsets);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findFset = (req, res) => {
  const {
    fsetID
  } = req.params;

  if (validateId(fsetID)) {

    const mongooseQuery = Fset.findById(fsetID);

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
      .then((fset) => {
        res.json(fset);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateFset = (req, res) => {
  const {
    fsetID
  } = req.params;

  const {
    title,
    description,
    creator,
    project,
    type,
    category
  } = req.body;

  if (validateId(fsetID) && testAll(validateStringInput, title, description, type, category) && testAll(validateId, creator, project)) {
    Fset.findByIdAndUpdate(fsetID, {
        title,
        description,
        creator,
        project,
        type,
        category
      }, {
        new: true
      })
      .exec()
      .then((fset) => {
        const id = fset._id;
        handleLogs('Updated fset properties', id);
        res.json(fset);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteFset = (req, res) => {
  const {
    fsetID
  } = req.params;

  if (validateId(fsetID)) {
    Fset.findByIdAndRemove(fsetID)
      .exec()
      .then((fset) => {
        const id = fset._id;
        handleLogs('Deleted fset', id);
        res.json(fset);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createFset,
  readFsets,
  findFset,
  updateFset,
  deleteFset
};
