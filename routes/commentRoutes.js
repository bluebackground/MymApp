const commentController = require('../controllers/commentController.js');

module.exports = (app) => {

  // Comments
  app
    .route('/comments')
    .get(commentController.readComments)
    .post(commentController.createComment)
  // .delete(commentController.deleteComments);

  app
    .route('/comments/:commentID')
    .get(commentController.findComment)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);
};