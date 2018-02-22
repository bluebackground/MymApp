const featureController = require('../controllers/featureController.js');
const { authenticateUserWithPost } = require('../controllers/userController.js');

module.exports = (app) => {

  // Features

  app
    .route('/features/create')
    .post(authenticateUserWithPost, featureController.createFeature);

  app
    .route('/features/read')
    .post(featureController.readFeatures);

	app
		.route('/features/upvote')
		.post(authenticateUserWithPost, featureController.upvotePost);

  // app
  //   .route('/features')
  //   .get(featureController.readFeatures)
  //   .post(featureController.createFeature)
  // .delete(featureController.deleteFeatures);

  app
    .route('/features/:featureID')
    .get(featureController.findFeature)
    .put(featureController.updateFeature)
    .delete(featureController.deleteFeature);
};