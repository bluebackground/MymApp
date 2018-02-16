const mongoose = require('mongoose');
const Tech = require('../models/Tech.js');

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

const createTech = (req, res) => {
  const {
    name,
    description,
    source,
    type,
    category,
    tags
  } = req.body;

  if (testAll(validateStringInput, name, description, source, type, category, tags)) {
    // Commented out for tests.
    // console.log("createTech");
    const id = new mongoose.Types.ObjectId();
    const newTech = new Tech({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      name,
      description,
      source,
      type,
      category,
      tags
    });

    newTech.save()
      .then((tech) => {
        // handleLogs('Created new tech', id);
        res.json(tech);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readTechs = (req, res) => {

  const mongooseQuery = Tech.find();

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
    .then((techs) => {
      res.json(techs);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findTech = (req, res) => {
  const {
    techID
  } = req.params;

  if (validateId(techID)) {

    const mongooseQuery = Tech.findById(techID);

    // if (req.body.options.select && typeof req.body.options.select === 'string') {
    //   mongooseQuery.select(req.body.options.select);
    // }
    // 
    // if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
    //   req.body.options.populate.forEach((options) => {
    //     const k = Object.keys(options);
    //     if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
    //       mongoose.Query.populate(options);
    //     }
    //   });
    // }

    mongooseQuery.exec()
      .then((tech) => {
        res.json(tech);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateTech = (req, res) => {
  const {
    techID
  } = req.params;

  const {
    title,
    description,
    type,
    category
  } = req.body;

  if (validateId(techID) && testAll(validateStringInput, title, description, type, category)) {
    Tech.findByIdAndUpdate(techID, {
        title,
        description,
        type,
        category
      }, {
        new: true
      })
      .exec()
      .then((tech) => {
        const id = tech._id;
        handleLogs('Updated tech properties', id);
        res.json(tech);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteTech = (req, res) => {
  const {
    techID
  } = req.params;

  if (validateId(techID)) {
    Tech.findByIdAndRemove(techID)
      .exec()
      .then((tech) => {
        const id = tech._id;
        handleLogs('Deleted tech', id);
        res.json(tech);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createTech,
  readTechs,
  findTech,
  updateTech,
  deleteTech
};
