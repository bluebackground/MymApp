const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	type: {
		type: String,
		required: false,
		default: ''
	},
	tags: {
		type: String,
		required: true
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Project'
	}
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;