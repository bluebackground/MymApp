const mongoose = require('mongoose');
const Tweet = require('../models/Tweet.js');
const User = require('../models/User.js');

const {
  SUCCESS,
  SERVER_ERR,
  USER_ERR
} = require('../variables/statuses.js');

const {
  validateId,
  validateStringInput,
  validateNumberInput,
  validateArrayInput,
  validateObjectInput,
  testAll
} = require('../helpers/validators.js');

const {
  handleLogs,
  handleServerError,
  handleInvalidInput
} = require('../helpers/handlers.js');

const createTweet = (req, res) => {
  const {message} = req.body;

  if (testAll(validateStringInput, message)) {
    // Commented out for tests.
   //  const id = new mongoose.Types.ObjectId();
    const newTweet = new Tweet({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
		message,
		creator: req.user._id
    });

    newTweet.save()
      .then((tweet) => {
      //   handleLogs('Created new tweet', id);
        res.json(tweet);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readTweets = (req, res) => {

  const mongooseQuery = Tweet.find();

  if (req.body.options.query && typeof req.body.options.query === 'object') {
    mongooseQuery.find(req.body.options.query);
  } else {
    mongooseQuery.find({});
  }

  if (req.body.options.sortBy && typeof req.body.options.sortBy === 'object') {
    mongooseQuery.sort(req.body.options.sortBy);
  }

  if (req.body.options.limit && typeof req.body.options.limit === 'number') {
    mongooseQuery.limit(req.body.options.limit);
  }

  if (req.body.options.select && typeof req.body.options.select === 'string') {
    mongooseQuery.select(req.body.options.select);
  }

  if (req.body.options.populate && Array.isArray(req.body.options.populate) && req.body.options.populate.length > 0) {
    req.body.options.populate.forEach((options) => {
      const k = Object.keys(options);
      if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
        mongooseQuery.populate(options);
      }
    });
  }

  mongooseQuery.exec()
    .then((tweets) => {
      res.json(tweets);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findTweet = (req, res) => {
  const {
    tweetID
  } = req.params;

  if (validateId(tweetID)) {

    const mongooseQuery = Tweet.findById(tweetID);

    if (req.body.options.select && typeof req.body.options.select === 'string') {
      mongooseQuery.select(req.body.options.select);
    }

    if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
      req.body.options.populate.forEach((options) => {
        const k = Object.keys(options);
        if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
          mongoose.Query.populate(options);
        }
      });
    }

    mongooseQuery.exec()
      .then((tweet) => {
        res.json(tweet);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateTweet = (req, res) => {
  const {
    tweetID
  } = req.params;

  const {
    title,
    description,
    creator,
    project,
    fset,
    type,
    category
  } = req.body;

  if (validateId(tweetID) && testAll(validateStringInput, title, description, type, category) && testAll(validateId, creator, project, fset)) {
    Tweet.findByIdAndUpdate(tweetID, {
        title,
        description,
        creator,
        project,
        fset,
        type,
        category
      }, {
        new: true
      })
      .exec()
      .then((tweet) => {
        const id = tweet._id;
        handleLogs('Updated tweet properties', id);
        res.json(tweet);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteTweet = (req, res) => {
  const {
    tweetID
  } = req.params;

  if (validateId(tweetID)) {
    Tweet.findByIdAndRemove(tweetID)
      .exec()
      .then((tweet) => {
        const id = tweet._id;
        handleLogs('Deleted tweet', id);
        res.json(tweet);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

const readMyTweets = (req, res) => {
	User.findById(req.user._id)
		.then((user) => {
			// console.log(user.follows);
			const usersList = user.follows;
			usersList.push(user._id);
			// console.log(usersList);
			// user.follows.push(user._id);
			// console.log(usersList.follows);
			Tweet.find({
				"creator": {
					$in: usersList
				}
			})
			.limit(100)
			.populate('creator', 'username')
			.then((tweets) => {
				// console.log(tweets);
				res.json(tweets);
			})
			.catch((err) => {
				console.log(err.message);
				handleServerError(res, err);
			});

		})
		.catch((err) => {
			console.log(err.message);
			handleServerError(res, err);
		});
}

const likeTweet = (req, res) => {

	const {tweetID} = req.body;

	if (validateId(tweetID)) {
		Tweet.findById(tweetID)
			.then((tweet) => {
				if (!containsId(req.user._id, tweet.likes)) {
					tweet.likes.push(req.user._id);
					tweet.save();
					console.log(`${req.user.username} added to tweet likes`);
					res.status(SUCCESS).send();
					return;
				}
				handleInvalidInput(res);
			})
			.catch((err) => {
				console.log(err.message);
				handleServerError(res, err);
			})
		return;
	}
	handleInvalidInput(res);
}

function containsId(id, arr) {
	for (let i of arr) {
		if (i.toHexString() === id.toHexString()) {
			return true;
		}
	}
	return false;
}

module.exports = {
  createTweet,
  readTweets,
  findTweet,
  updateTweet,
  deleteTweet,
  readMyTweets,
  likeTweet
};
