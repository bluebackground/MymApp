const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// TODO: Add a way to track user login history.

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    default: null
  },
  email: {
    type: String,
    require: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '${VALUE} is not a valid email'
    }
  },
  hashedPassword: {
    type: String,
    required: true,
    minLength: 6
  },
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null
  },
  about: {
    type: String,
    required: true,
    default: null,

  },
  skills: {
    type: Array,
    required: false,
    default: [],

  },
  interests: {
    type: Array,
    required: false,
    default: [],

  },
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  follows: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  stars: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: null,

  },
  contributions: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true
    }
  }]
});

/**
 *  MODEL Methods
 */

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({
    email
  }).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.hashedPassword, (err, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
}

/**
 * INSTANCE Methods
 */

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, process.env.JWT_SECRET).toString();

  user.tokens.push({
    access,
    token
  });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return {
    _id: userObject._id,
    email: userObject.email
  }
};

UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

UserSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('hashedPassword')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.hashedPassword, salt, (err, hash) => {
        user.hashedPassword = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
