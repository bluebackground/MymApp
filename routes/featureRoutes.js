const featureController = require('../controllers/featureController.js');

module.exports = (app) => {

  // Features
  app
    .route('/features')
    .get(featureController.readFeatures)
    .post(featureController.createFeature)
  // .delete(featureController.deleteFeatures);

  app
    .route('/features/:featureID')
    .get(featureController.findFeature)
    .put(featureController.updateFeature)
    .delete(featureController.deleteFeature);
};