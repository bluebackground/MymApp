const fsetController = require('../controllers/fsetController.js');

module.exports = (app) => {

  // Fsets
  app
    .route('/fsets')
    .get(fsetController.readFsets)
    .post(fsetController.createFset)
  // .delete(fsetController.deleteFsets);

  app
    .route('/fsets/:fsetID')
    .get(fsetController.findFset)
    .put(fsetController.updateFset)
    .delete(fsetController.deleteFset);
};