var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var https = require('https');
var request = require('request');
var config = require('../../config.js');

module.exports = function(app, env, passport) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		console.log("home route");
		res.render('pages/index');
	});

	app.get('/getStockData', function(req, res) {
		var apiBaseUrl = 'https://www.alphavantage.co/query?';
		var timeSeriesType = 'TIME_SERIES_DAILY';
		var apiOutputSize = 'compact'
		var stockSymbol = 'MSFT'; // TODO: Get this dynamically from user

		var apiFullUrl = 
			apiBaseUrl 
			+ 'function=' + timeSeriesType 
			+ '&symbol=' + stockSymbol 
			+ '&outputsize=' + apiOutputSize 
			+ '&apikey=' + config.appConfig.ALPHA_VANTAGE_API_KEY;
	
		request.get(apiFullUrl, { json: true }, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				console.log(result);
			}
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};