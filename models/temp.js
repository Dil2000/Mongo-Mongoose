	var mongoose = require("mongoose");

	var Schema = mongoose.Schema;

	var TempSchema = new Schema({

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
		}	
	});

	var Temp = mongoose.model("Temp", TempSchema);

	module.exports = Temp;