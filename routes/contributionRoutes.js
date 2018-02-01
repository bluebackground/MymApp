const contributionController = require('../controllers/contributionController.js');

module.exports = (app) => {

  // Contributions
  app
    .route('/contributions')
    .get(contributionController.readContributions)
    .post(contributionController.createContribution)
  // .delete(contributionController.deleteContributions);

  app
    .route('/contributions/:contributionID')
    .get(contributionController.findContribution)
    .put(contributionController.updateContribution)
    .delete(contributionController.deleteContribution);
};