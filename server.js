var express = require('express');
var session = require('express-session');
var routes = require('./src/routes/routes.js');
var http = require('http');
var io = require('socket.io')(http);

var app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

routes(app, process.env);

// Socket.io Connection
io.on('connection', function(socket) {
	socket.emit('connection', []);

	socket.on('stock', function(stockData) {
		console.log("Socket stock data");
	});

	socket.on('disconnect', function() {
		console.log("Socket Disconnected!");
	});

});

app.set('port', (process.env.PORT || 8080));

app.listen(process.env.PORT || 8080, function() {
	console.log('Server Listening on Port 8080');
});