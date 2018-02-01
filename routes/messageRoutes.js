const messageController = require('../controllers/messageController.js');

module.exports = (app) => {

  // Messages
  app
    .route('/messages')
    .get(messageController.readMessages)
    .post(messageController.createMessage)
  // .delete(messageController.deleteMessages);

  app
    .route('/messages/:messageID')
    .get(messageController.findMessage)
    .put(messageController.updateMessage)
    .delete(messageController.deleteMessage);
};