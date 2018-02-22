const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true,
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		default: [],
		ref: "User"
	}],
});

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;