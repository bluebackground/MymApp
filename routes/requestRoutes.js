const requestController = require('../controllers/requestController.js');

module.exports = (app) => {

  // Requests
  app
    .route('/requests')
    .get(requestController.readRequests)
    .post(requestController.createRequest)
  // .delete(requestController.deleteRequests);

  app
    .route('/requests/:requestID')
    .get(requestController.findRequest)
    .put(requestController.updateRequest)
    .delete(requestController.deleteRequest);
};