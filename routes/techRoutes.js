const techController = require('../controllers/techController.js');

module.exports = (app) => {

  // Techs
  app
    .route('/techs/find')
    .post(techController.readTechs);

  app
    .route('/tech/create')
    .post(techController.createTech);
  // .delete(techController.deleteTechs);

  app
    .route('/tech/:techID')
    .get(techController.findTech)
    .put(techController.updateTech)
    .delete(techController.deleteTech);
};
