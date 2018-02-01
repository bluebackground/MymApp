const pollController = require('../controllers/pollController.js');

module.exports = (app) => {

  // Polls
  app
    .route('/polls')
    .get(pollController.readPolls)
    .post(pollController.createPoll)
  // .delete(pollController.deletePolls);

  app
    .route('/polls/:pollID')
    .get(pollController.findPoll)
    .put(pollController.updatePoll)
    .delete(pollController.deletePoll);
};