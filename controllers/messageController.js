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
    user
  } = req.body;

  if (testAll(validateStringInput, text)) {
    // Commented out for tests.
    // const id = new mongoose.Types.ObjectId();
    const newMessage = new Message({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      text,
      from: req.user._id,
      to: user._id,
    });

    newMessage.save()
      .then((message) => {
        // handleLogs('Created new message', id);
        res.json(message);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const getMyMessages = (req, res) => {
  Message.find({
      $or: [{
        from: req.user._id
      }, {
        to: req.user._id
      }]
    })
    .populate('from', 'username')
    .populate('to', 'username')
    .then((messages) => {
      res.send(messages);
    })
    .catch((err) => {
      console.log(err.message);
      handleServerError(res, err);
    });
}

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

const removeMessage = (req, res) => {
  const {
    messageID
  } = req.body;

  if (validateId(messageID)) {
    // TODO: put a check in place to make sure that this user can only delete message that they are the destination/owner of.
    Message.findByIdAndRemove(messageID)
      .then((message) => {
        if (!message) {
          handleInvalidInput(res);
          return;
        }
        res.send(message);
      })
      .catch((err) => {
        console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}

const archiveMessage = (req, res) => {
  const {
    messageID
  } = req.body;

  if (validateId(messageID)) {
    // TODO: put a check in place to make sure that this user can only delete message that they are the destination/owner of.
    Message.findByIdAndUpdate(messageID, {
        status: 'archived'
      }, {
        new: true
      })
      .exec()
      .then((message) => {
        // const id = message._id;
        // handleLogs('Updated message properties', id);
        if (!message) {
          handleInvalidInput(res);
          return;
        }
        res.json(message);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}

const unarchiveMessage = (req, res) => {
  const {
    messageID
  } = req.body;

  if (validateId(messageID)) {
    Message.findByIdAndUpdate(messageID, {
        status: 'active'
      }, {
        new: true
      })
      .exec()
      .then((message) => {
        if (!message) {
          handleInvalidInput(res);
          return;
        }
        res.status(SUCCESS).send();
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}

const getMessage = (req, res) => {
  const {
    messageID
  } = req.body;

  if (validateId(messageID)) {
    Message.findOne({
        _id: messageID,
        $or: [{
          to: req.user._id
        }, {
          from: req.user._id
        }]
      })
      .populate('from', 'username')
      .populate('to', 'username')
      .then((message) => {
        if (!message) {
          handleInvalidInput(res);
          return;
        }
        res.send(message);
      })
      .catch((err) => {
        console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}

module.exports = {
  createMessage,
  readMessages,
  findMessage,
  updateMessage,
  deleteMessage,
  archiveMessage,
  removeMessage,
  getMyMessages,
  unarchiveMessage,
  getMessage
};
