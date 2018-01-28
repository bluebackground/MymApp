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


const authenticateUser = (req, res, next) => {
  const token = req.header('x-auth');
  // console.log("AuthenticateUser");
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        // console.log("Reject");
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch((err) => {
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
        res.header('x-auth', token).send(newUser);
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
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(SUCCESS).send();
  });
};

const getMe = (req, res) => {
  // console.log("getMe");
  res.send(req.user);
}

const removeToken = (req, res) => {
  // console.log("removeToken");
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

  if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
    req.body.options.populate.forEact((options) => {
      const k = Object.keys(options);
      if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
        mongoose.Query.populate(options);
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
          mongoose.Query.populate(options);
        }
      });
    }

    mongooseQuery.exec()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
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

module.exports = {
  authenticateUser,
  createUser,
  userLogin,
  getMe,
  removeToken,
  findUsers,
  findUser,
  updateUser
}
