const userRoutes = require('./userRoutes.js');

const techRoutes = require('../routes/techRoutes.js');
const projectRoutes = require('../routes/projectRoutes.js');
const discussionRoutes = require('../routes/discussionRoutes.js');
const featureRoutes = require('../routes/featureRoutes.js');

const messageRoutes = require('../routes/messageRoutes.js');
const requestRoutes = require('../routes/requestRoutes.js');
const commentRoutes = require('../routes/commentRoutes.js');
const invitationRoutes = require('../routes/invitationRoutes.js');
const noteRoutes = require('../routes/noteRoutes.js');
const contributionRoutes = require('../routes/contributionRoutes.js');
const tweetRoutes = require('../routes/tweetRoutes.js');
// const storyRoutes = require('../routes/storyRoutes.js');
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
  featureRoutes(app);
  noteRoutes(app);
  contributionRoutes(app);
  tweetRoutes(app);
  // storyRoutes(app);
  // fsetRoutes(app);
  // pollRoutes(app);
};
