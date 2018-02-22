const userController = require('../controllers/userController.js');

module.exports = (app) => {

  app
    .route('/users/create')
    .post(userController.createUser);

  app
    .route('/users/find')
    .post(userController.findUsers);

  app
    .route('/users/login')
	 .post(userController.userLogin);
	 
app
	.route('/users/myFollows')
	.post(userController.authenticateUserWithPost, userController.getMyFollows);

  app
    .route('/users/me')
    .post(userController.authenticateUserWithPost, userController.getMe);
  //.put();

  app
    .route('/users/username/:username')
    .post(userController.authenticateUserWithPost, userController.getUserByUsername);

  app
    .route('/users/me/token')
    .delete(userController.authenticateUser, userController.removeToken);

	app
		.route('/users/followUser')
		.post(userController.authenticateUserWithPost, userController.followUser);

	app
		.route('/users/followProject')
		.post(userController.authenticateUserWithPost, userController.followProject);
	
	app
		.route('/users/followDiscussion')
		.post(userController.authenticateUserWithPost, userController.followDiscussion);
	
	app
		.route('/users/favoriteTech')
		.post(userController.authenticateUserWithPost, userController.favoriteTech);
  // app
  //   .route('/users/:userId')
  //   .get(userController.findUser);
}
