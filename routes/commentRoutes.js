const commentController = require('../controllers/commentController.js');
const {
  authenticateUserWithPost
} = require('../controllers/userController.js');

module.exports = (app) => {

  // Comments
  app
    .route('/comments/create')
    .post(authenticateUserWithPost, commentController.createComment);

  app
    .route('/comments/find')
    .post(commentController.readComments);

  // app
  //   .route('/comments')
  //   .get(commentController.readComments)
  //   .post(commentController.createComment)
  // .delete(commentController.deleteComments);

  app
    .route('/comments/:commentID')
    .get(commentController.findComment)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);
};
