const mongoose = require('mongoose');
const Project = require('../models/Project.js');
const User = require('../models/User.js');

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
    visibility,
    access,
    status,
    bannerMessage,
    technologies,
    tags
  } = req.body;

  if (testAll(validateStringInput, title, description, github, visibility, access, status) /*&& testAll(validateArrayInput, likes, stories, featuresets, features, requests, invitations, polls, history, comments, technologies, tags, followers, advisors, participants) && testAll(validateId, owner)*/ ) {
    // Commented out for tests.
    // console.log("TESTING");
    const id = new mongoose.Types.ObjectId();
    const newProject = new Project({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      bannerMessage,
      github,
      visibility,
      access,
      status,
      technologies,
      tags
    });

    newProject.save()
      .then((project) => {
        // handleLogs('Created new project', id);
        // console.log(project);
        res.json(project);
      })
      .catch((err) => {
        console.log(err);
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
        mongooseQuery.populate(options);
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

    Project.findById(projectID)
      .select('title github status description participants bannerMessage tags technologies visibility access')
      .populate({
        path: 'participants',
        select: 'username'
      })

      .exec()

      // if (req.body.options.select && typeof req.body.options.select === 'string') {
      //   mongooseQuery.select(req.body.options.select);
      // }
      //
      // if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
      //   req.body.options.populate.forEach((options) => {
      //     const k = Object.keys(options);
      //     if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
      //       mongooseQuery.populate(options);
      //     }
      //   });
      // }

      // mongooseQuery.populate({
      //   path: 'participants',
      //   select: 'username'
      // });

      .then((proj) => {
        // console.log(proj);
        // console.log(proj.participants[0].username);
        // console.log(proj.participants[0]);
        // console.log(JSON.stryarningify(proj.participants[0]));
        res.json(proj);
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

const joinProject = (req, res) => {
  const {
    projectID
  } = req.body;

  // console.log(req.user);
  // console.log(req.body);

  if (validateId(projectID)) {
    // Get project and add user Id to project.
    Project.findById(projectID)
      .then((project) => {
        if (!project) {
          handleInvalidInput(res);
        }
        // console.log(project);
        if (!containsUserId(req.user._id, project)) {
          console.log('adding user to project');
          project.participants.push(req.user._id);
          project.save();
        } else {
          console.log('user already found on project');
        }

        if (!containsProjectId(project._id, req.user)) {
          console.log('adding project to user');
          // console.log(req.user);
          req.user.projects.push(project._id);
          req.user.save();
        } else {
          console.log('project already found on user');
        }

        res.status(SUCCESS).send();
      })
      .catch((err) => {
        console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}

function containsUserId(id, proj) {
  for (let userID of proj.participants) {
    if (userID.toHexString() === id.toHexString()) {
      console.log(userID, id);
      return true;
    }
  }
  return false;
}

function containsProjectId(id, user) {
  for (let projectID of user.projects) {
    if (projectID.toHexString() === id.toHexString()) {
      console.log(projectID, id);
      return true;
    }
  }
  return false;
}

module.exports = {
  createProject,
  readProjects,
  findProject,
  updateProject,
  deleteProject,
  joinProject
};
