const invitationController = require('../controllers/invitationController.js');
const {
  authenticateUserWithPost
} = require('../controllers/userController.js');

module.exports = (app) => {

  // Invitations

  app
    .route('/invitations/create')
    .post(authenticateUserWithPost, invitationController.createInvitation);

  app
    .route('/invitations/me')
    .post(authenticateUserWithPost, invitationController.getMyInvitations);

  app
    .route('/invitations/accept')
    .post(authenticateUserWithPost, invitationController.acceptInvitation);

  // app
  //   .route('/invitations')
  //   .get(invitationController.readInvitations)
  //   .post(invitationController.createInvitation)
  // .delete(invitationController.deleteInvitations);

  app
    .route('/invitations/:invitationID')
    .get(invitationController.findInvitation)
    .put(invitationController.updateInvitation)
    .delete(invitationController.deleteInvitation);
};
