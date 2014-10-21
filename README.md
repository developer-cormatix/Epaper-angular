 EPAPER
===================

A light-weight Epaper viewer App completely built using NodeJS,  Angular JS & HTML. In previous model loading data from XML files and loading into the Epaper container is with PHP. In this Light-weight epaper instead of loading from XML files everything is loaded from only JSON files(Editions.json and corresponding dates.json files to the everydate for that edition).

Features
--------

* User Management (Registering with Email, Login with Email,Google+ and Facebook).

* Loading Epaper for selected date and edition.

* Downloading a page as PDF file.

* User can read the article in Text,Image and PDF view.

* Storing the Click Stream.(Storing email of the user,article_id,IP of the machine from where he is reading and date of read).

* All written with HTML5,Node.js and Angular.js.

Requirement
-----------

* [Node.js](http://nodejs.org/)

* [MongoDB](http://www.mongodb.org/)

Installation
-------------

* Place JSON files and related all folders & files in data folder.

* Change the path parameter in config file to path to the data folder.

* Start your MongoDB server with `mongodb` (modify the address if you need to in the config file)

* You can now create a user,login and view epaper by connecting to localhost:3000 (you can change the port inside the config file)

Used
----

* [Angular.js](http://angularjs.org/)

* [HTML5](http://www.w3schools.com/html/html5_intro.asp)

TODO
----

* Flip animation when page loading.

* Search Operation.

* Clean UI.
