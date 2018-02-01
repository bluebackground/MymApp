const mongoose = require('mongoose');
const Project = require('../models/Project.js');

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

const createProject = (req, res) => {
  const {
    title,
    description,
    github,
    likes,
    visibility,
    stories,
    featuresets,
    features,
    access,
    status,
    requests,
    invitations,
    polls,
    history,
    comments,
    technologies,
    tags,
    followers,
    advisors,
    participants,
    owner
  } = req.body;

  if (testAll(validateStringInput, title, description, github, visibility, access, status) && testAll(validateArrayInput, likes, stories, featuresets, features, requests, invitations, polls, history, comments, technologies, tags, followers, advisors, participants) && testAll(validateId, owner)) {
    // Commented out for tests.
    const id = new mongoose.Types.ObjectId();
    const newProject = new Project({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      github,
      likes,
      visibility,
      stories,
      featuresets,
      features,
      access,
      status,
      requests,
      invitations,
      polls,
      history,
      comments,
      technologies,
      tags,
      followers,
      advisors,
      participants,
      owner
    });

    newProject.save()
      .then((project) => {
        handleLogs('Created new project', id);
        res.json(project);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readProjects = (req, res) => {

  const mongooseQuery = Project.find();

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
    .then((projects) => {
      res.json(projects);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findProject = (req, res) => {
  const {
    projectID
  } = req.params;

  if (validateId(projectID)) {

    const mongooseQuery = Project.findById(projectID);

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
      .then((project) => {
        res.json(project);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateProject = (req, res) => {
  const {
    projectID
  } = req.params;

  const {
    title,
    description,
    github,
    likes,
    visibility,
    stories,
    featuresets,
    features,
    access,
    status,
    requests,
    invitations,
    polls,
    history,
    comments,
    technologies,
    tags,
    followers,
    advisors,
    participants,
    owner
  } = req.body;

  if (validateId(projectID) && testAll(validateStringInput, title, description, github, visibility, access, status) && testAll(validateArrayInput, likes, stories, featuresets, features, requests, invitations, polls, history, comments, technologies, tags, followers, advisors, participants) && testAll(validateId, owner)) {
    Project.findByIdAndUpdate(projectID, {
        title,
        description,
        github,
        likes,
        visibility,
        stories,
        featuresets,
        features,
        access,
        status,
        requests,
        invitations,
        polls,
        history,
        comments,
        technologies,
        tags,
        followers,
        advisors,
        participants,
        owner
      }, {
        new: true
      })
      .exec()
      .then((project) => {
        const id = project._id;
        handleLogs('Updated project properties', id);
        res.json(project);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteProject = (req, res) => {
  const {
    projectID
  } = req.params;

  if (validateId(projectID)) {
    Project.findByIdAndRemove(projectID)
      .exec()
      .then((project) => {
        const id = project._id;
        handleLogs('Deleted project', id);
        res.json(project);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

module.exports = {
  createProject,
  readProjects,
  findProject,
  updateProject,
  deleteProject
};
