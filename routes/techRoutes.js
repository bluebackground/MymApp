const techController = require('../controllers/techController.js');

module.exports = (app) => {

  // Techs
  app
    .route('/techs/find')
    .post(techController.readTechs);

  app
    .route('/techs/create')
    .post(techController.createTech);
  // .delete(techController.deleteTechs);

  app
    .route('/techs/:techID')
    .get(techController.findTech)
    .put(techController.updateTech)
    .delete(techController.deleteTech);
};
