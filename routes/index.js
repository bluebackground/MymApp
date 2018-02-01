const projectRoutes = require('../routes/projectRoutes.js');
const messageRoutes = require('../routes/messageRoutes.js');
const contributionRoutes = require('../routes/contributionRoutes.js');
const requestRoutes = require('../routes/requestRoutes.js');
const invitationRoutes = require('../routes/invitationRoutes.js');
const commentRoutes = require('../routes/commentRoutes.js');
const storyRoutes = require('../routes/storyRoutes.js');
const featureRoutes = require('../routes/featureRoutes.js');
const fsetRoutes = require('../routes/fsetRoutes.js');
const techRoutes = require('../routes/techRoutes.js');
const pollRoutes = require('../routes/pollRoutes.js');
const userRoutes = require('./userRoutes.js');

module.exports = (app) => {
  userRoutes(app);
  projectRoutes(app);
  messageRoutes(app);
  contributionRoutes(app);
  requestRoutes(app);
  invitationRoutes(app);
  commentRoutes(app);
  storyRoutes(app);
  featureRoutes(app);
  fsetRoutes(app);
  techRoutes(app);
  pollRoutes(app);
};
