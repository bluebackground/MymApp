const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: null,

  },
  description: {
    type: String,
    required: true,
    default: null,

  },
  bannerMessage: {
    type: String,
    required: true,
    default: null
  },
  github: {
    type: String,
    required: true,
    default: null,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  visibility: {
    type: String,
    required: true,
    default: null,
  },
  stories: {
    type: Array,
    required: false,
    default: [],
  },
  featuresets: {
    type: Array,
    required: false,
    default: [],
  },
  features: {
    type: Array,
    required: false,
    default: [],
  },
  access: {
    type: String,
    required: true,
    default: null,
  },
  status: {
    type: String,
    required: true,
    default: null,

  },
  requests: {
    type: Array,
    required: false,
    default: [],

  },
  invitations: {
    type: Array,
    required: false,
    default: [],
  },
  polls: {
    type: Array,
    required: false,
    default: [],
  },
  history: {
    type: Array,
    required: false,
    default: [],
  },
  comments: {
    type: Array,
    required: false,
    default: [],

  },
  technologies: {
    type: String,
    required: false,
    default: null,
    ref: 'collectionName'
  },
  tags: {
    type: String,
    required: false,
    default: null,
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  advisors: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
  }
});

// STATIC METHODS
ProjectSchema.statics.getAllProjects = function () {
  return;
}

// OBJECT METHODS
ProjectSchema.methods.getTitle = function () {
  return this.title;
}

ProjectSchema.methods.getDescription = function () {
  return this.description;
}

ProjectSchema.methods.getGithub = function () {
  return this.github;
}

ProjectSchema.methods.getLikes = function () {
  return this.likes;
}

ProjectSchema.methods.getVisibility = function () {
  return this.visibility;
}

ProjectSchema.methods.getStories = function () {
  return this.stories;
}

ProjectSchema.methods.getFeaturesets = function () {
  return this.featuresets;
}

ProjectSchema.methods.getFeatures = function () {
  return this.features;
}

ProjectSchema.methods.getAccess = function () {
  return this.access;
}

ProjectSchema.methods.getStatus = function () {
  return this.status;
}

ProjectSchema.methods.getRequests = function () {
  return this.requests;
}

ProjectSchema.methods.getInvitations = function () {
  return this.invitations;
}

ProjectSchema.methods.getPolls = function () {
  return this.polls;
}

ProjectSchema.methods.getHistory = function () {
  return this.history;
}

ProjectSchema.methods.getComments = function () {
  return this.comments;
}

ProjectSchema.methods.getTechnologies = function () {
  return this.technologies;
}

ProjectSchema.methods.getTags = function () {
  return this.tags;
}

ProjectSchema.methods.getFollowers = function () {
  return this.followers;
}

ProjectSchema.methods.getAdvisors = function () {
  return this.advisors;
}

ProjectSchema.methods.getParticipants = function () {
  return this.participants;
}

ProjectSchema.methods.getOwner = function () {
  return this.owner;
}

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
