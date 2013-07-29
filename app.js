var express = require("express"),
  http = require('http'),
  path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser()); // In order to use req.session.someProperty
app.use(express.session({ secret: 'super-duper-secret-secret' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function () {
  app.use(express.errorHandler());
});

require('./server/router')(app);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
