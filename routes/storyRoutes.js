const storyController = require('../controllers/storyController.js');

module.exports = (app) => {

  // Storys
  app
    .route('/storys')
    .get(storyController.readStorys)
    .post(storyController.createStory)
  // .delete(storyController.deleteStorys);

  app
    .route('/storys/:storyID')
    .get(storyController.findStory)
    .put(storyController.updateStory)
    .delete(storyController.deleteStory);
};