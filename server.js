
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");

var logger = require("morgan");
var mongoose = require("mongoose");

var exphbs = require('express-handlebars');
var methodOverride = require("method-override");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

//Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(methodOverride("_method"));

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Make public a static dir
app.use(express.static("public"));

// local Database configuration with mongoose
//mongoose.connect("mongodb://localhost/week18day3mongoose");
// heroku database configuration
mongoose.connect(process.env.DB_HOST);

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// // database
// var db = require("./models");

// Routes
var routes = require("./controllers/article-controller.js");
app.use("/", routes(app));


// Listen on port 3000
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Listening at PORT " + PORT);
});






