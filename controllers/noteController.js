const mongoose = require('mongoose');
const Note = require('../models/Note.js');

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

const createNote = (req, res) => {
  const {
	title,
	description,
	projectID,
	tags
  } = req.body;

  if (testAll(validateStringInput, title, description, tags) && testAll(validateId, projectID)) {
    // Commented out for tests.
   //  const id = new mongoose.Types.ObjectId();
    const newNote = new Note({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      creator: req.user._id,
      project: projectID,
      tags
    });

    newNote.save()
      .then((note) => {
      //   handleLogs('Created new note', id);
        res.json(note);
      })
      .catch((err) => {
			console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readNotes = (req, res) => {

  const mongooseQuery = Note.find();

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

  if (req.body.options.populate && Array.isArray(req.body.options.populate) && req.body.options.populate.length > 0) {
    req.body.options.populate.forEach((options) => {
      const k = Object.keys(options);
      if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
        mongooseQuery.populate(options);
      }
    });
  }

  mongooseQuery.exec()
    .then((notes) => {
      res.json(notes);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findNote = (req, res) => {
  const {
    noteID
  } = req.params;

  if (validateId(noteID)) {

	 const mongooseQuery = Note.findById(noteID)
	 	.populate('project', 'title')
      .populate('creator', 'username');

   //  if (req.body.options.select && typeof req.body.options.select === 'string') {
   //    mongooseQuery.select(req.body.options.select);
   //  }

   //  if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
   //    req.body.options.populate.forEach((options) => {
   //      const k = Object.keys(options);
   //      if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
   //        mongoose.Query.populate(options);
   //      }
   //    });
   //  }

    mongooseQuery.exec()
      .then((note) => {
        res.json(note);
      })
      .catch((err) => {
			console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateNote = (req, res) => {
  const {
    noteID
  } = req.params;

  const {
    title,
    description,
    creator,
    project,
    fset,
    type,
    category
  } = req.body;

  if (validateId(noteID) && testAll(validateStringInput, title, description, type, category) && testAll(validateId, creator, project, fset)) {
    Note.findByIdAndUpdate(noteID, {
        title,
        description,
        creator,
        project,
        fset,
        type,
        category
      }, {
        new: true
      })
      .exec()
      .then((note) => {
        const id = note._id;
        handleLogs('Updated note properties', id);
        res.json(note);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteNote = (req, res) => {
  const {
    noteID
  } = req.params;

  if (validateId(noteID)) {
    Note.findByIdAndRemove(noteID)
      .exec()
      .then((note) => {
        const id = note._id;
        handleLogs('Deleted note', id);
        res.json(note);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createNote,
  readNotes,
  findNote,
  updateNote,
  deleteNote
};
