const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// TODO: Add a way to track user login history.

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    minLength: 1,
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
    required: false,
    default: null,
  },
  skills: {
    type: String,
    required: false,
    default: "",
  },
  interests: {
    type: String,
    required: false,
    default: "",
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: [],
    ref: 'Project'
  }],
  follows: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
    ref: 'collectionName'
  },
  stars: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
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
  }).catch((e) => {
    console.log("ERROR: in findByCredentials()");
    throw new Error("Error in User model static method: " + e.message);
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

  // For the time being i'm going to clear all other tokens and then add.
  // user.tokens = [{}];

  const check = user.tokens.filter((tok) => {
    // console.log(tok.access === access);
    // console.log(tok.token);
    // console.log("******");
    // console.log(token);
    if (tok.access === access && tok.token === token) {
      return true;
    }
    return false;
  });

  // console.log(check.length);
  if (check.length === 0) {
    user.tokens.push({
      access,
      token
    });
  }

  // console.log(user);
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return {
    _id: userObject._id,
    email: userObject.email,
    username: userObject.username,
    projects: userObject.projects,
    skills: userObject.skills,
    interests: userObject.interests
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
