var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var https = require('https');
var request = require('request');
var config = require('../../config.js');
var StockCtrl = require('../controllers/stockController.js');

module.exports = function(app, env, passport) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		var appStockData = req.app.locals.stockData;
		var appStocks = req.app.locals.stocks;
		res.render('pages/index', {
			stocks: appStocks,
			stockData: appStockData,
			searchError: ''
		});
	});

	// Sample call: https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=demo
	app.post('/getStockData', function(req, res) {
		var apiBaseUrl = 'https://www.alphavantage.co/query?';
		var timeSeriesType = 'TIME_SERIES_DAILY';
		var apiOutputSize = 'compact'
		var stockSymbol = req.body.searchStockSymbol;
		var stockSymbolArr = req.app.locals.stockSymbols || [];
		var stockArr = req.app.locals.stocks || [];

		if(!stockSymbolArr.includes(stockSymbol)) {
			stockSymbolArr.push(stockSymbol);
			req.app.locals.stockSymbols = stockSymbolArr;
		}

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
				var stockObj;

				if(dailyStockData) {
					var stockDataKeys = Object.keys(dailyStockData);
					
					for(var i = 0; i < numOfDays; i++) {
						resultArr.push(dailyStockData[stockDataKeys[i]][stockDataFieldName]);
					}

					req.app.locals.stockData = resultArr;

					stockObj = {
						symbol: stockSymbol,
						data: resultArr
					};

					StockCtrl.getStockIndex(req, stockSymbol, stockArr, function(resultIndex) {
						// resultIndex = -1 means stock is not in array
						if(resultIndex < 0) {
							stockArr.push(stockObj);
							req.app.locals.stocks = stockArr;
						}
					});
				}
				else {
					console.log("No Data Found for Symbol: " + stockSymbol);
					errorMessage = "No Data Found for Symbol: " + stockSymbol;
				}

				res.render('pages/index', {
					stocks: stockArr,
					stockSymbols: stockSymbolArr,
					stockData: resultArr,
					searchError: errorMessage
				});
			}
		});
	});

	app.post('/deleteStockData', function(req, res) {
		var appStocks = req.app.locals.stocks;
		var stockSymbol = req.body.symbol;

		console.log(stockSymbol);
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};