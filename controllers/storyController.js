const mongoose = require('mongoose');
const Story = require('../models/Story.js');

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

const createStory = (req, res) => {
  const {
    title,
    description,
    creator,
    project,
    priority,
    votes
  } = req.body;

  if (testAll(validateStringInput, title, description) && testAll(validateNumberInput, priority) && testAll(validateArrayInput, votes) && testAll(validateId, creator, project)) {
    // Commented out for tests.
    const id = new mongoose.Types.ObjectId();
    const newStory = new Story({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      creator,
      project,
      priority,
      votes
    });

    newStory.save()
      .then((story) => {
        handleLogs('Created new story', id);
        res.json(story);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readStorys = (req, res) => {

  const mongooseQuery = Story.find();

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
    .then((storys) => {
      res.json(storys);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findStory = (req, res) => {
  const {
    storyID
  } = req.params;

  if (validateId(storyID)) {

    const mongooseQuery = Story.findById(storyID);

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
      .then((story) => {
        res.json(story);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateStory = (req, res) => {
  const {
    storyID
  } = req.params;

  const {
    title,
    description,
    creator,
    project,
    priority,
    votes
  } = req.body;

  if (validateId(storyID) && testAll(validateStringInput, title, description) && testAll(validateNumberInput, priority) && testAll(validateArrayInput, votes) && testAll(validateId, creator, project)) {
    Story.findByIdAndUpdate(storyID, {
        title,
        description,
        creator,
        project,
        priority,
        votes
      }, {
        new: true
      })
      .exec()
      .then((story) => {
        const id = story._id;
        handleLogs('Updated story properties', id);
        res.json(story);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteStory = (req, res) => {
  const {
    storyID
  } = req.params;

  if (validateId(storyID)) {
    Story.findByIdAndRemove(storyID)
      .exec()
      .then((story) => {
        const id = story._id;
        handleLogs('Deleted story', id);
        res.json(story);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createStory,
  readStorys,
  findStory,
  updateStory,
  deleteStory
};
