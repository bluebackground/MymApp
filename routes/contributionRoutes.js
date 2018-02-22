const contributionController = require('../controllers/contributionController.js');
const { authenticateUserWithPost } = require('../controllers/userController.js');

module.exports = (app) => {

  // Contributions

	app
		.route('/contributions/create')
		.post(authenticateUserWithPost, contributionController.createContribution);
	
	app
		.route('/contributions/read')
		.post(contributionController.readContributions);

	app
		.route('/contributions/confirm')
		.post(authenticateUserWithPost, contributionController.confirmContribution);

	app
		.route('/contributions/me')
		.post(authenticateUserWithPost, contributionController.getMyContributions);
//   app
//     .route('/contributions')
//     .get(contributionController.readContributions)
//     .post(contributionController.createContribution)
  // .delete(contributionController.deleteContributions);

  app
    .route('/contributions/:contributionID')
    .get(contributionController.findContribution);
   //  .put(contributionController.updateContribution)
   //  .delete(contributionController.deleteContribution);
};