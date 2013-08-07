var express = require("express"),
  http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.set('views', __dirname + '/server/views');
app.use(app.router);


app.get("/", function (req, res) {
  res.render('test', {titile : "Test"});
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});