const mongoose = require('mongoose');
const Feature = require('../models/Feature.js');

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

const createFeature = (req, res) => {
  const {
    title,
    description,
	 category,
	 tasks,
	 projectID
  } = req.body;

  if (testAll(validateStringInput, title, description, category, tasks) && testAll(validateId, projectID)) {
    // Commented out for tests.
   //  const id = new mongoose.Types.ObjectId();
    const newFeature = new Feature({
      // Commented out for tests.
      // Uncomment for production.
      // _id: id,
      title,
      description,
      creator: req.user._id,
		project: projectID,
		tasks: tasks,
      category
    });

    newFeature.save()
      .then((feature) => {
      //   handleLogs('Created new feature', id);
        res.json(feature);
      })
      .catch((err) => {
			console.log(err.message);
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const readFeatures = (req, res) => {
	// console.log(req.body.options);
  const mongooseQuery = Feature.find();

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
    .then((features) => {
      res.json(features);
    })
    .catch((err) => {
      handleServerError(res);
    });
};

const findFeature = (req, res) => {
  const {
    featureID
  } = req.params;

  if (validateId(featureID)) {

	 const mongooseQuery = Feature.findById(featureID)
		 .populate('project', 'title')
		 .populate('creator', 'username');

   //  if (req.body.options.select && typeof req.body.options.select === 'string') {
   //    mongooseQuery.select(req.body.options.select);
   //  }

   //  if (req.body.options.populate && typeof req.body.options.populate === 'array' && req.body.options.populate.length > 0) {
   //    req.body.options.populate.forEach((options) => {
   //      const k = Object.keys(options);
   //      if (typeof options === 'object' && k.includes('path') && k.includes('select')) {
   //        mongoose.Query.populate(options);
   //      }
   //    });
   //  }

    mongooseQuery.exec()
      .then((feature) => {
        res.json(feature);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const updateFeature = (req, res) => {
  const {
    featureID
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

  if (validateId(featureID) && testAll(validateStringInput, title, description, type, category) && testAll(validateId, creator, project, fset)) {
    Feature.findByIdAndUpdate(featureID, {
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
      .then((feature) => {
        const id = feature._id;
        handleLogs('Updated feature properties', id);
        res.json(feature);
      })
      .catch((err) => {
        handleServerError(res, err);
      });
    return;
  }
  handleInvalidInput(res);
};

const deleteFeature = (req, res) => {
  const {
    featureID
  } = req.params;

  if (validateId(featureID)) {
    Feature.findByIdAndRemove(featureID)
      .exec()
      .then((feature) => {
        const id = feature._id;
        handleLogs('Deleted feature', id);
        res.json(feature);
      })
      .catch((err) => {
        handleServerError(res, err);
      })
    return;
  }
  handleInvalidInput(res);
};

const upvotePost = (req, res) => {
	const {
		featureID
	} = req.body;

	if (validateId(featureID)) {
		Feature.findById(featureID)
			.then((feature) => {
				if (!containsId(req.user._id, feature.upvotes)) {
					feature.upvotes.push(req.user._id);
					feature.save();
					res.status(SUCCESS).send();
					console.log("Id added to feature upvotes");
					return;
				}
				res.status(SUCCESS).send();
			})
			.catch((err) => {
				handleServerError(res, err);
			});
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
  createFeature,
  readFeatures,
  findFeature,
  updateFeature,
  deleteFeature,
  upvotePost
};
