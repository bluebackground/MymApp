const tweetController = require('../controllers/tweetController.js');
const { authenticateUserWithPost } = require('../controllers/userController.js');

module.exports = (app) => {

  // Tweets

	app
		.route('/tweets/create')
		.post(authenticateUserWithPost, tweetController.createTweet);
	
	app
		.route('/tweets/read')
		.post(authenticateUserWithPost, tweetController.readTweets);

	app
		.route('/tweets/readMyTweets')
		.post(authenticateUserWithPost, tweetController.readMyTweets);

	app
		.route('/tweets/like')
		.post(authenticateUserWithPost, tweetController.likeTweet);

//   app
//     .route('/tweets')
//     .get(tweetController.readTweets)
//     .post(tweetController.createTweet)
  // .delete(tweetController.deleteTweets);

//   app
//     .route('/tweets/:tweetID')
//     .get(tweetController.findTweet);
   //  .put(tweetController.updateTweet)
   //  .delete(tweetController.deleteTweet);
};