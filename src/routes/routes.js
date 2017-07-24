var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var https = require('https');
var request = require('request');

module.exports = function(app, env, passport) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		console.log("home route");
		res.render('pages/index');
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};