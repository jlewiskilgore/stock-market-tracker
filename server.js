var express = require('express');
var session = require('express-session');
var routes = require('./src/routes/routes.js');

var app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

routes(app, process.env);

app.set('port', (process.env.PORT || 8080));

app.listen(process.env.PORT || 8080, function() {
	console.log('Server Listening on Port 8080');
});