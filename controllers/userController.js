const mongoose = require('mongoose');
const User = require('../models/User.js');

const {
  SUCCESS,
  SERVER_ERR,
  USER_ERR,
  UNAUTHORIZED,
  BAD_REQUEST
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
  // handleLogs,
  handleServerError,
  handleInvalidInput
} = require('../helpers/handlers.js');

const authenticateUserWithPost = (req, res, next) => {
  const tok = req.body.token;

  User.findByToken(tok)
    .then((user) => {
      if (!user) {
        // console.log("Reject");
		//   return Promise.reject('No user found from token');
		  return Promise.reject();
      }
      req.user = user;
      req.token = tok;
      next();
    })
    .catch((err) => {
      // console.log(err.message);
      res.status(UNAUTHORIZED).send();
    });
}

const authenticateUser = (req, res, next) => {
  // const token = req.header('x-auth');
  // console.log("AuthenticateUser");
  // User.findByToken(token)
  //   .then((user) => {
  //     if (!user) {
  //       // console.log("Reject");
  //       return Promise.reject();
  //     }
  //     req.user = user;
  //     req.token = token;
  //     next();
  //   })
  //   .catch((err) => {
  //     res.status(UNAUTHORIZED).send();
  //   });

  // Adding this section to accomodate axios problems with headers x-auth
  const tok = req.query.token;
  // console.log(req);
  // console.log(tok);

  User.findByToken(tok)
    .then((user) => {
      if (!user) {
        // console.log("Reject");
        return Promise.reject();
      }
      req.user = user;
      req.token = tok;
      next();
    })
    .catch((err) => {

      //TODO: Fix some sort of unhandled promise
      console.log(err.message);
      res.status(UNAUTHORIZED).send();
    });
}

const createUser = (req, res) => {
  // console.log("CreateUser");
  const {
    username,
    email,
    password
  } = req.body;

  if (testAll(validateStringInput, username, email, password)) {
    const id = new mongoose.Types.ObjectId();

    const newUser = new User({
      // _id: id,
      username,
      email,
      hashedPassword: password
    });

    newUser.save()
      .then(() => {
        return newUser.generateAuthToken();
      })
      .then((token) => {
        res.header('x-auth', token).send(token);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const userLogin = (req, res) => {
  // console.log("userLogin");
  const password = req.body.password;
  const email = req.body.email;

  User.findByCredentials(email, password).then((user) => {
    // console.log(user);
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(token);
    });
  }).catch((e) => {
    console.log(e.message);
    handleServerError(res, e);
  });
};

const getMe = (req, res) => {
  // console.log("getMe");
  User.findById(req.user._id)
	 .populate('projects', 'title')
	 .populate('favoriteTech', 'name')
	 .populate('follows', 'username')
	 .populate('discussionFollows', 'title')
	 .populate('projectFollows', 'title')
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err.message);
      handleServerError(res, err);
    });
  // OLD - res.send(req.user);
}

const removeToken = (req, res) => {
  // console.log("removeToken");
  // Alternate code
  // const tok = req.body.token;

  // req.user.removeToken(tok).then(() => {
  //   res.status(SUCCESS).send();
  // }, () => {
  //   res.status(BAD_REQUEST).send();
  // });

  // Authenticate path has to be changed as well.
  // This uses x-auth. axios doesn't manage this properly
  req.user.removeToken(req.token).then(() => {
    res.status(SUCCESS).send();
  }, () => {
    res.status(BAD_REQUEST).send();
  });
}

const findUsers = (req, res) => {
  // console.log("findUsers");
  const mongooseQuery = User.find();

  if (req.body.options.query && typeof req.body.options.query === 'object') {
    mongooseQuery.find(req.body.options.query);
  } else {
    mongooseQuery.find({});
  }

  if (req.body.options.sortBy && typeof req.body.options.sortyBy === 'object') {
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
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findUser = (req, res) => {
  // console.log("findUser");
  const {
    userID
  } = req.params;

  if (validateId(userID)) {
    const mongooseQuery = User.findById(userID);

    if (req.body.options.select && typeof req.body.options.select === 'string') {
      mongooseQuery.select(req.body.options.select);
    }

    if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
      req.body.options.populate.forEach((options) => {
        const k = Object.keys(options);
        if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
          mongooseQuery.populate(options);
        }
      });
    }

    mongooseQuery.exec()
      .then((user) => {
        if (!user) {
          handleInvalidInput(res);
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}

const getUserByUsername = (req, res) => {
  const {
    username
  } = req.params;

  if (validateStringInput(username)) {
    User.findOne({
        username
      })
		.populate('projects', 'title')
		.populate('favoriteTech', 'name')
		.populate('discussionFollows', 'title')
		.populate('projectFollows', 'title')
		.populate('follows', 'username')
      .then((user) => {
        if (!user) {
          handleInvalidInput(res);
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
}

const updateUser = (req, res) => {
  // TODO: Be able to update user using x-auth from authenticateUser.
  // TODO: req.user is available.
}

const getMyFollows = (req, res) => {
	User.findById(req.user._id)
		.select('follows username')
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.log(err.message);
			handleServerError(res, err);
		});
}

const followProject = (req, res) => {
	const {
		projectID
	} = req.body;

	if(validateId(projectID)) {
		if (!containsId(projectID, req.user.projectFollows)) {
			req.user.projectFollows.push(projectID);
			req.user.save();
			res.status(SUCCESS).send();
			return;
		}
		console.log("id already exists in user projectFollows");
		res.status(SUCCESS).send();
		return;
	}
	handleInvalidInput(res);
}

const followUser = (req, res) => {
	const {
		userID
	} = req.body;

	if(validateId(userID)) {
		if (!containsId(userID, req.user.follows)) {
			req.user.follows.push(userID);
			req.user.save();
			res.status(SUCCESS).send();
			return;
		}
		console.log("id already exists in user userFollows");
		res.status(SUCCESS).send();
		return;
	}
	handleInvalidInput(res);
}

const followDiscussion = (req, res) => {
	const {
		discussionID
	} = req.body;

	if(validateId(discussionID)) {
		if (!containsId(discussionID, req.user.discussionFollows)) {
			req.user.discussionFollows.push(discussionID);
			req.user.save();
			res.status(SUCCESS).send();
			return;
		}
		console.log("id already exists in user discussionFollows");
		res.status(SUCCESS).send();
		return;
	}
	handleInvalidInput(res);
}

const favoriteTech = (req, res) => {
	const {
		techID
	} = req.body;

	if(validateId(techID)) {
		if (!containsId(techID, req.user.favoriteTech)) {
			req.user.favoriteTech.push(techID);
			req.user.save();
			res.status(SUCCESS).send();
			return;
		}
		console.log("id already exists in user favoriteTech");
		res.status(SUCCESS).send();
		return;
	}
	handleInvalidInput(res);
}

function containsId(id, arr) {
	for (let i of arr) {
		if (i.toHexString() === id) {
			return true;
		}
	}
	return false;
}

module.exports = {
  authenticateUser,
  createUser,
  userLogin,
  getMe,
  removeToken,
  findUsers,
  findUser,
  updateUser,
  authenticateUserWithPost,
  getUserByUsername,
  followProject,
  followUser,
  followDiscussion,
  favoriteTech,
  getMyFollows
}
