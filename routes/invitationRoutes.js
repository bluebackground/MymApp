const invitationController = require('../controllers/invitationController.js');

module.exports = (app) => {

  // Invitations
  app
    .route('/invitations')
    .get(invitationController.readInvitations)
    .post(invitationController.createInvitation)
  // .delete(invitationController.deleteInvitations);

  app
    .route('/invitations/:invitationID')
    .get(invitationController.findInvitation)
    .put(invitationController.updateInvitation)
    .delete(invitationController.deleteInvitation);
};