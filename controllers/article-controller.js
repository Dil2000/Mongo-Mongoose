
var express = require("express");

var router = express.Router();

// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var Temp = require("../models/temp.js");

var path = require('path');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping



module.exports = function(app) {

		
// ---------------------------------------------------------------
// Get Data from Tech Crunch Website save in a temporary table
// ---------------------------------------------------------------

app.get("/scrape", function(req, res) {

  Temp.remove({}, function (err) {
    if (err) return handleError(err);
    // removed past data!
  });

  // First, we grab the body of the html with request
  request("https://techcrunch.com/gadgets/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.post-title").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.data = $(this).siblings("p.excerpt").text();
      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Temp(result);

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
  
  // res.render('scrapped');
  res.render("scrape");
});


// ---------------------------------------------------------------
// Show data on the scraped from the website
// ---------------------------------------------------------------

app.get("/scrapped", function(req, res) {

  Temp.find({}, function(error,found) {
     if (error) {
        console.log(error);
     }
     else {
        var articleObj = {
          temps: found
        };
      //res.json(found);
      res.render('scrapped',articleObj)
     }
  })

});


// ---------------------------------------------------------------
// Save scraped articles
// ---------------------------------------------------------------

app.post("/add", function(req, res) {

  var result = {}
  result.title = req.body.title;
  result.link = req.body.link;
  result.data = req.body.body;

  var newArticle = new Article(result);

  newArticle.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      res.redirect("/");
    }
  });
});


// ---------------------------------------------------------------
// Home page show the articles and comments
// ---------------------------------------------------------------

app.get("/notes", function(req, res) {

  Note.find({}, function(error,found) {
     if (error) {
        console.log(error);
     }
     else {
       res.json(found);
       //res.render('index',found)
     }
  });

});

app.get("/articles", function(req, res) {

  Article.find({}, function(error,found) {
     if (error) {
        console.log(error);
     }
     else {
       res.json(found);
       //res.render('index',found)
     }
  });

});


// ---------------------------------------------------------------
// Home page show the articles
// ---------------------------------------------------------------

app.get("/", function(req, res) {

  Article.find().sort({ "date" : 1 }).populate('note').exec(function(error,found) {
     if (error) {
        console.log(error);
     }
     else {
       //res.json(found);
        var articleObj = {
                  articles: found
                };
        res.render('index',articleObj);
        console.log("done");
     }
  });

});


// ---------------------------------------------------------------
// Get article by its Id
// ---------------------------------------------------------------

app.get("/:id", function(req, res) {
	Article.findOne({"_id" : req.params.id}).populate("Note")
  .exec(function(error,found) {
     if (error) {
        console.log(error);
     }
     else {
      // res.json(found);
       //res.render('index',found)
       res.redirect("/");
     }
  });
});


// ---------------------------------------------------------------
// Create & Edit Notes for aticles
// ---------------------------------------------------------------

app.post("/:id", function(req, res) {

  var result = {}
  result.title = req.body.title;
  result.body = req.body.comment;

  var newNote = new Note(result);

  newNote.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find the article and push the new note id into the User's notes array
      Article.findOneAndUpdate({ "_id" : req.params.id }, { "note": doc._id })
      .exec(function(err, doc) {
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
         // res.send(doc);
         //res.render("index");
         res.redirect("/");
        }
      });
    }
  });
});


// ---------------------------------------------------------------
// Delete a Note
// ---------------------------------------------------------------

  app.get("/notes/:id", function(req, res) {
    Note.find({"_id" : req.params.id}, function(err, user) {
      if (error) {
        console.log(error);
      }
      else {
       //res.json(found);
        var articleObj = {
                  articles: found
                };
        res.json(found);
        console.log("Note done");
      }
    });
  });

  app.post("/notes/:id", function(req, res) {
    Note.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
        console.log(err);
      }
      else {
          // Find the article and push the new note id into the User's notes array
        Article.findOneAndUpdate({ "note" : req.params.id }, { "note": "" })
        .exec(function(err, doc) {
          if (err) {
            res.send(err);
          }
          else {
           // res.send(doc);
           //res.render("index");
           res.redirect("/");
          }
        });
      }
    });
  });
 

// ---------------------------------------------------------------
// Delete an article
// ---------------------------------------------------------------

  app.get("/article/:id", function(req, res) {
    Article.find({"_id" : req.params.id}, function(err, user) {
      if (error) {
        console.log(error);
      }
      else {
       //res.json(found);
        var articleObj = {
                  articles: found
                };
        res.json(found);
        console.log("done");
      }
    });

  });


  app.post("/article/:id", function(req, res) {

    Article.findByIdAndRemove(req.params.id,function(err) {
      if (err) {
        console.log(err);
      }
      console.log('Deleted !');
      //res.render("index");
      res.redirect("/");
    });
  });



 

//  app.delete("/articles", function(req, res) {
//   Article.remove({},function(err) {
//      if (err) {
//                 console.log(err)
//             } else {
//                 res.end('success');
//             }
//   });
// });



return router;

};

