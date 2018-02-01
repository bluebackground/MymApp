const projectController = require('../controllers/projectController.js');

module.exports = (app) => {

  // Projects
  app
    .route('/projects')
    .get(projectController.readProjects)
    .post(projectController.createProject)
  // .delete(projectController.deleteProjects);

  app
    .route('/projects/:projectID')
    .get(projectController.findProject)
    .put(projectController.updateProject)
    .delete(projectController.deleteProject);
};