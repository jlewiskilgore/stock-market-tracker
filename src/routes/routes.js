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
		res.render('pages/index', {
			stockData: [],
			searchError: ''
		});
	});

	// Sample call: https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=demo
	app.post('/getStockData', function(req, res) {
		var apiBaseUrl = 'https://www.alphavantage.co/query?';
		var timeSeriesType = 'TIME_SERIES_DAILY';
		var apiOutputSize = 'compact'
		var stockSymbol = req.body.searchStockSymbol; // TODO: Get this dynamically from user
		console.log(stockSymbol);

		var resultDataType = 'Time Series (Daily)';
		var stockDataFieldName = '4. close';
		var numOfDays = 10; // Get stock data from last 10 days

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
				var resultArr = [];
				var errorMessage;
				var dailyStockData = result.body[resultDataType];

				if(dailyStockData) {
					var stockDataKeys = Object.keys(dailyStockData);
					
					for(var i = 0; i < numOfDays; i++) {
						resultArr.push(dailyStockData[stockDataKeys[i]][stockDataFieldName]);
					}
					console.log(resultArr);
				}
				else {
					console.log("No Data Found for Symbol: " + stockSymbol);
					errorMessage = "No Data Found for Symbol: " + stockSymbol;
				}

				res.render('pages/index', {
					stockData: resultArr,
					searchError: errorMessage
				});
			}
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};