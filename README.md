
# Latest Tech News :newspaper: :computer: :microscope:

## Scrape the Latest News from the Tech Crunch Website 

Visit the Heroku domain  - https://news-dil.herokuapp.com/

## How to use :cop:
	1. Goto Scrape New News Page
	2. After it scrapes the latest news from Tech Crunch It will direct to the Scrapped News page
	3. If the User likes a news they can save it. After saving the News it show the perticular News in the Home Page. Users can Delete the News or Add Comments and Titles for the Comments for that News. If User does not want the comment they can delete the comment or else they can edit the comments. 

## Home Page :information_desk_person:
![starting Window](public/assets/img/17.png "Image 1") 

## Technology used :no_good:

	* MongoDB database and Mongoose to manage the database.
		Connects to Mongo local when using locally or Connect to Heroku Mongo Database for Local use as well as for normal app use.
	* The data will save into a temporary table which to be deleted when the user scrapes for the latest news again.
	* News details saves in one collection and comment details will be saved in a  seperate collection. Comments table IDs will be a forign Key in the News Table so it can releate the comments to the News.
 	* Follows MVC Design Pattern - Node JS, Express, Express Handlebars
 	* HTML5, CSS3, Bootstrap, FontAwesome and Google Fonts for designs.
 	* Clone it to your brower and change the news sources.





 