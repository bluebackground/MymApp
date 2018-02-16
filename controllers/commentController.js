const mongoose = require('mongoose');
const Comment = require('../models/Comment.js');

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

const createComment = (req, res) => {
  const {
    description,
    discussionID
  } = req.body;

  if (testAll(validateStringInput, description) && testAll(validateId, discussionID)) {
    // Commented out for tests.
    // const id = new mongoose.Types.ObjectId();
    const newComment = new Comment({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      description,
      from: req.user._id,
      discussion: discussionID
    });

    newComment.save()
      .then((comment) => {
        // handleLogs('Created new comment', id);
        res.json(comment);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readComments = (req, res) => {

  const mongooseQuery = Comment.find();

  if (req.body.options.query && typeof req.body.options.query === 'object') {
    // console.log("query test");
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

  //TODO: Update script code
  if (req.body.options.populate && Array.isArray(req.body.options.populate) && req.body.options.populate.length > 0) {
    // console.log("populate test");
    req.body.options.populate.forEach((option) => {
      const k = Object.keys(option);
      if (typeof option === 'object' && k.includes('path') && k.includes('select') && option.path && option.select) {
        // console.log(option);
        mongooseQuery.populate(option);
      }
    });
  }

  mongooseQuery.exec()
    .then((comments) => {
      // console.log("POST comments/read");
      // console.log(comments);
      res.json(comments);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findComment = (req, res) => {
  const {
    commentID
  } = req.params;

  if (validateId(commentID)) {

    const mongooseQuery = Comment.findById(commentID);

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
      .then((comment) => {
        res.json(comment);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateComment = (req, res) => {
  const {
    commentID
  } = req.params;

  const {
    title,
    description,
    from,
    project
  } = req.body;

  if (validateId(commentID) && testAll(validateStringInput, title, description) && testAll(validateId, from, project)) {
    Comment.findByIdAndUpdate(commentID, {
        title,
        description,
        from,
        project
      }, {
        new: true
      })
      .exec()
      .then((comment) => {
        const id = comment._id;
        handleLogs('Updated comment properties', id);
        res.json(comment);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteComment = (req, res) => {
  const {
    commentID
  } = req.params;

  if (validateId(commentID)) {
    Comment.findByIdAndRemove(commentID)
      .exec()
      .then((comment) => {
        const id = comment._id;
        handleLogs('Deleted comment', id);
        res.json(comment);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createComment,
  readComments,
  findComment,
  updateComment,
  deleteComment
};
