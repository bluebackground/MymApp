const messageController = require('../controllers/messageController.js');
const {
  authenticateUserWithPost
} = require('../controllers/userController.js');

module.exports = (app) => {

  // Messages
  app
    .route('/messages/one')
    .post(authenticateUserWithPost, messageController.getMessage);

  app
    .route('/messages/find')
    .post(authenticateUserWithPost, messageController.getMyMessages);

  app
    .route('/messages/create')
    .post(authenticateUserWithPost, messageController.createMessage);

	app
		.route('/messages/create2')
		.post(authenticateUserWithPost, messageController.createMessageFromUsername);

  app
    .route('/messages/archive')
    .post(authenticateUserWithPost, messageController.archiveMessage);

  app
    .route('/messages/unarchive')
    .post(authenticateUserWithPost, messageController.unarchiveMessage);

  // .delete(messageController.deleteMessages);

  app
    .route('/messages/:messageID')
    .get(messageController.findMessage)
    .put(messageController.updateMessage)
    .delete(messageController.deleteMessage);
};
