const mongoose = require('mongoose');
const Contribution = require('../models/Contribution.js');

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

const createContribution = (req, res) => {
  const {
    title,
    description,
	 to
  } = req.body;

  if (testAll(validateStringInput, title, description) && testAll(validateId, to._id)) {
    // Commented out for tests.
   //  const id = new mongoose.Types.ObjectId();
    const newContribution = new Contribution({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
		description,
		to: to._id,
		toUsername: to.username,
      creator: req.user._id
    });

    newContribution.save()
      .then((contribution) => {
      //   handleLogs('Created new contribution', id);
        res.json(contribution);
      })
      .catch((err) => {
			console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readContributions = (req, res) => {

  const mongooseQuery = Contribution.find();

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
    .then((contributions) => {
      res.json(contributions);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findContribution = (req, res) => {
  const {
    contributionID
  } = req.params;

  if (validateId(contributionID)) {

	 const mongooseQuery = Contribution.findById(contributionID)
	 .populate('confirmations', 'username')
	 .populate('creator', 'username');

   //  if (req.body.options.select && typeof req.body.options.select === 'string') {
   //    mongooseQuery.select(req.body.options.select);
   //  }

   //  if (req.body.options.populate && Array.isArray(req.body.options.populate) && req.body.options.populate.length > 0) {
   //    req.body.options.populate.forEach((options) => {
   //      const k = Object.keys(options);
   //      if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
   //        mongooseQuery.populate(options);
   //      }
   //    });
   //  }

    mongooseQuery.exec()
      .then((contribution) => {
        res.json(contribution);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateContribution = (req, res) => {
  const {
    contributionID
  } = req.params;

  const {
    title,
    description,
    creator,
    comfirmations,
    technology,
    type,
    category
  } = req.body;

  if (validateId(contributionID) && testAll(validateStringInput, title, description, technology, type, category) && testAll(validateArrayInput, comfirmations) && testAll(validateId, creator)) {
    Contribution.findByIdAndUpdate(contributionID, {
        title,
        description,
        creator,
        comfirmations,
        technology,
        type,
        category
      }, {
        new: true
      })
      .exec()
      .then((contribution) => {
        const id = contribution._id;
        handleLogs('Updated contribution properties', id);
        res.json(contribution);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteContribution = (req, res) => {
  const {
    contributionID
  } = req.params;

  if (validateId(contributionID)) {
    Contribution.findByIdAndRemove(contributionID)
      .exec()
      .then((contribution) => {
        const id = contribution._id;
        handleLogs('Deleted contribution', id);
        res.json(contribution);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

const getMyContributions = (req, res) => {
	Contribution.find({
		to: req.user._id
	})
	.then((contributions) => {
		res.json(contributions);
	})
	.catch((err) => {
		console.log(err.message);
		handleServerError(res, err);
	});
}

const confirmContribution = (req, res) => {
	const {contributionID} = req.body;
	
	Contribution.findById(contributionID)
		.then((contribution) => {
			if (!containsId(req.user._id, contribution.confirmations)){
				contribution.confirmations.push(req.user._id);
				contribution.save();
				res.status(SUCCESS).send();
				return;
			}
			handleInvalidInput(res);
		})
		.catch((err) => {
			console.log(err.message);
			handleServerError(res, err);
		});
}

function containsId(uId, arr) {
	for (let i of arr) {
		if (i.toHexString() === uId.toHexString()) {
			return true;
		}
	}
	return false;
}

module.exports = {
  createContribution,
  readContributions,
  findContribution,
  updateContribution,
  deleteContribution,
  confirmContribution,
  getMyContributions
};
