const mongoose = require('mongoose');
const Invitation = require('../models/Invitation.js');

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

const createInvitation = (req, res) => {
  const {
    title,
    description,
    role,
    from,
    to,
    project
  } = req.body;

  if (testAll(validateStringInput, title, description, role) && testAll(validateId, from, to, project)) {
    // Commented out for tests.
    const id = new mongoose.Types.ObjectId();
    const newInvitation = new Invitation({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      role,
      from,
      to,
      project
    });

    newInvitation.save()
      .then((invitation) => {
        handleLogs('Created new invitation', id);
        res.json(invitation);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readInvitations = (req, res) => {

  const mongooseQuery = Invitation.find();

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
    .then((invitations) => {
      res.json(invitations);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findInvitation = (req, res) => {
  const {
    invitationID
  } = req.params;

  if (validateId(invitationID)) {

    const mongooseQuery = Invitation.findById(invitationID);

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
      .then((invitation) => {
        res.json(invitation);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateInvitation = (req, res) => {
  const {
    invitationID
  } = req.params;

  const {
    title,
    description,
    role,
    from,
    to,
    project
  } = req.body;

  if (validateId(invitationID) && testAll(validateStringInput, title, description, role) && testAll(validateId, from, to, project)) {
    Invitation.findByIdAndUpdate(invitationID, {
        title,
        description,
        role,
        from,
        to,
        project
      }, {
        new: true
      })
      .exec()
      .then((invitation) => {
        const id = invitation._id;
        handleLogs('Updated invitation properties', id);
        res.json(invitation);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteInvitation = (req, res) => {
  const {
    invitationID
  } = req.params;

  if (validateId(invitationID)) {
    Invitation.findByIdAndRemove(invitationID)
      .exec()
      .then((invitation) => {
        const id = invitation._id;
        handleLogs('Deleted invitation', id);
        res.json(invitation);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createInvitation,
  readInvitations,
  findInvitation,
  updateInvitation,
  deleteInvitation
};
