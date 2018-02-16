const discussionController = require('../controllers/discussionController.js');

module.exports = (app) => {
  app
    .route('/discussions/find')
    .post(discussionController.readDiscussions);

  app
    .route('/discussions/create')
    .post(discussionController.createDiscussion);

  app
    .route('/discussion/:discussionID')
    .get(discussionController.findDiscussion);
}
