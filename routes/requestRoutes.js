const requestController = require('../controllers/requestController.js');

const {
  authenticateUserWithPost
} = require('../controllers/userController.js');

module.exports = (app) => {

  // Requests

  app
    .route('/requests/create')
    .post(authenticateUserWithPost, requestController.createRequest);

  app
    .route('/requests/read')
    .post(requestController.readRequests);

  // app
  //   .route('/requests')
  //   .get(requestController.readRequests)
  //   .post(requestController.createRequest)
  // .delete(requestController.deleteRequests);

  app
    .route('/requests/:requestID')
    .get(requestController.findRequest)
    .put(requestController.updateRequest)
    .delete(requestController.deleteRequest);
};
