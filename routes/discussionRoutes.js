const discussionController = require('../controllers/discussionController.js');

module.exports = (app) => {
  app
    .route('/discussions/find')
    .post(discussionController.findDiscussions);

  app
    .route('/discussions/create')
    .post(discussionController.createDiscussion);
}
