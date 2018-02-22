const noteController = require('../controllers/noteController.js');
const { authenticateUserWithPost } = require('../controllers/userController.js');

module.exports = (app) => {

  // Features
  app
    .route('/notes/create')
    .post(authenticateUserWithPost, noteController.createNote);

  app
    .route('/notes/read')
    .post(noteController.readNotes);

  app
    .route('/notes/:noteID')
    .get(noteController.findNote);
    // .put(noteController.updateFeature)
    // .delete(noteController.deleteFeature);
};