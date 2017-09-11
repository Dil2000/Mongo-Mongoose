
var express = require("express");

var router = express.Router();

// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

var path = require('path');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping



module.exports = function(app) {

		
// ---------------------------------------------------------------
// Get Data from Tech Crunch Website
// ---------------------------------------------------------------

app.get("/scrape", function(req, res) {

  // First, we grab the body of the html with request
  request("https://techcrunch.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.post-title").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});


// ---------------------------------------------------------------
// Show data on the scraped from the website
// ---------------------------------------------------------------

app.get("/articles", function(req, res) {

  // TODO: Finish the route so it grabs all of the articles
  Article.find({}, function(error,found) {
     if (error) {
        console.log(error);
     }
     else {
       res.json(found);
       //res.render('index',found)
     }
  })


});


// ---------------------------------------------------------------
// Home page show the articles and comments
// ---------------------------------------------------------------

app.get("/", function(req, res) {

  Article.find({}, function(error,found) {
     if (error) {
        console.log(error);
     }
     else {
       //res.json(found);
        var articleObj = {
                  articles: found
                };
        res.render('index',articleObj);
     }
  })

});


// ---------------------------------------------------------------
// Get article comments
// ---------------------------------------------------------------
app.get("/articles/:id", function(req, res) {


});


// ---------------------------------------------------------------
// Create Notes for aticles
// ---------------------------------------------------------------

// app.post("/:id", function(req, res) {

//   var newNote = new Note(req.body);

//   newNote.save(function(error, doc) {
//     // Send any errors to the browser
//     if (error) {
//       res.send(error);
//     }
//     // Otherwise
//     else {
//       // Find our user and push the new note id into the User's notes array
//       Note.findOneAndUpdate({}, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
//         // Send any errors to the browser
//         if (err) {
//           res.send(err);
//         }
//         // Or send the newdoc to the browser
//         else {
//           res.send(newdoc);
//         }
//       });
//     }
//   });

  // TODO
  // ====

  // save the new note that gets posted to the Notes collection

  // then find an article from the req.params.id

  // and update it's "note" property with the _id of the new note


// });

return router;

};
