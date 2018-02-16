const userRoutes = require('./userRoutes.js');

const techRoutes = require('../routes/techRoutes.js');
const projectRoutes = require('../routes/projectRoutes.js');
const discussionRoutes = require('../routes/discussionRoutes.js');

const messageRoutes = require('../routes/messageRoutes.js');
const requestRoutes = require('../routes/requestRoutes.js');
const commentRoutes = require('../routes/commentRoutes.js');
const invitationRoutes = require('../routes/invitationRoutes.js');
// const contributionRoutes = require('../routes/contributionRoutes.js');
// const storyRoutes = require('../routes/storyRoutes.js');
// const featureRoutes = require('../routes/featureRoutes.js');
// const fsetRoutes = require('../routes/fsetRoutes.js');

// const pollRoutes = require('../routes/pollRoutes.js');

module.exports = (app) => {
  userRoutes(app);
  techRoutes(app);
  projectRoutes(app);
  discussionRoutes(app);
  messageRoutes(app);
  requestRoutes(app);
  commentRoutes(app);
  invitationRoutes(app);
  // contributionRoutes(app);
  // storyRoutes(app);
  // featureRoutes(app);
  // fsetRoutes(app);
  // pollRoutes(app);
};
