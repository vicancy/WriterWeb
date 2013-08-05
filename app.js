var express = require("express"),
  http = require('http'),
  tty = require('tty'),
  path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(express.favicon("public/images/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser()); // In order to use req.session.someProperty
app.use(express.session({ secret: 'super-duper-secret-secret' }));
app.use(app.router);
//app.use(require('stylus').middleware({ src: __dirname + 'public' }));
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function () {
  console.log("using dev mode...");
  app.use(express.errorHandler());
});

app.configure('production', function () {
  console.log("using prod mode...");
});

require('./server/router')(app);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

//Monitor process exiting action
/*process.openStdin().on("keypress", function(chunck, key) {
  if (key && key.name === "c" && key.ctrl) {
    console.log("Ctrl + C pressed");
    process.exit();
  }
});

process.on('exit', function(){
  console.log("Exiting...");
});
*/