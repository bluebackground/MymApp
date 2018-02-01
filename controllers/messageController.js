const mongoose = require('mongoose');
const Message = require('../models/Message.js');

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

const createMessage = (req, res) => {
  const {
    text,
    from,
    to,
    priority
  } = req.body;

  if (testAll(validateStringInput, text) && testAll(validateNumberInput, priority) && testAll(validateId, from, to)) {
    // Commented out for tests.
    const id = new mongoose.Types.ObjectId();
    const newMessage = new Message({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      text,
      from,
      to,
      priority
    });

    newMessage.save()
      .then((message) => {
        handleLogs('Created new message', id);
        res.json(message);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readMessages = (req, res) => {

  const mongooseQuery = Message.find();

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
    .then((messages) => {
      res.json(messages);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findMessage = (req, res) => {
  const {
    messageID
  } = req.params;

  if (validateId(messageID)) {

    const mongooseQuery = Message.findById(messageID);

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
      .then((message) => {
        res.json(message);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateMessage = (req, res) => {
  const {
    messageID
  } = req.params;

  const {
    text,
    from,
    to,
    priority
  } = req.body;

  if (validateId(messageID) && testAll(validateStringInput, text) && testAll(validateNumberInput, priority) && testAll(validateId, from, to)) {
    Message.findByIdAndUpdate(messageID, {
        text,
        from,
        to,
        priority
      }, {
        new: true
      })
      .exec()
      .then((message) => {
        const id = message._id;
        handleLogs('Updated message properties', id);
        res.json(message);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteMessage = (req, res) => {
  const {
    messageID
  } = req.params;

  if (validateId(messageID)) {
    Message.findByIdAndRemove(messageID)
      .exec()
      .then((message) => {
        const id = message._id;
        handleLogs('Deleted message', id);
        res.json(message);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createMessage,
  readMessages,
  findMessage,
  updateMessage,
  deleteMessage
};
