	var mongoose = require("mongoose");

	var Schema = mongoose.Schema;

	var ArticleSchema = new Schema({

		title: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: true
		},
		data: {
			type: String,
			required: false
		},
		date: {
			type: Date,
			default: Date.now
		},
		// Reference Key		
		note: {
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	});

	var Article = mongoose.model("Article", ArticleSchema);

	module.exports = Article;