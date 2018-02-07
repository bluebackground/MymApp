const projectController = require('../controllers/projectController.js');

module.exports = (app) => {

  // Projects
  app
    .route('/projects/find')
    .post(projectController.readProjects)

  app
    .route('/projects/create')
    .post(projectController.createProject)
  // .delete(projectController.deleteProjects);

  app
    .route('/projects/:projectID')
    .get(projectController.findProject)
    .put(projectController.updateProject)
    .delete(projectController.deleteProject);
};
