
var notebookManager = require('./modules/notebook-manager'),
  accountManager = require('./modules/account-manager');
module.exports = function (app) {

  //Login page
  app.get("/", function (req, res) {
    //check if the user's credentials are saved in a cookie
    if (req.cookies && req.cookies.user && req.cookies.pass) {
      //try automatic login
      accountManager.autoLogin(req.cookies.user, req.cookies.pass, function (o) {
        console.log("o", o);

        if (o) {
          req.session.user = o;
          res.redirect('/home');
        } else {
          res.render('login', { title: 'Please Login To Your Account' });
        }
      });
    } else {
      res.render('login', { title: 'Please Login To Your Account' });
    }
  });

  //Type in user/password and submit to login
  app.post('/', function (req, res) {
    accountManager.manualLogin(req.param('user'), req.param('pass'), function (e, o) {
      console.log("e & o", e, o);
      if (!o) {
        res.render('login', {title: 'Account not found, please try again.' });
        //res.redirect('/home');
      } else {
        req.session.user = o;
        if (req.param('remember-me') === 'true') {
          res.cookie('user', o.user, {maxAge: 900000 });
          res.cookie('pass', o.pass, {maxAge: 900000 });
        }

        res.send(o, 200);
      }
    });
  });

  //Home page
  app.get("/home", function (req, res) {
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.redirect('/');
    } else {
      var userId = req.session.user._id;
      notebookManager.getAvailableNotebooks(userId, function (err, items) {
        if (err) {
          throw err;
        }

        res.render('index', {title: 'My Notebook', tasks: items});
      });
    }
  });

  //Signup page
  app.get("/signup", function (req, res) {
    res.render('signup', { title: 'Signup' });
  });

  app.post('/signup', function (req, res) {
    accountManager.addNewAccount({
      user: req.param('user'),
      password: req.param('pass'),
      description: req.param('description')
    }, function (e) {
      //console.log(e);
      if (e){
        res.send(e, 400);
      } else{
        res.send('ok', 200);
      }
    });
  });

  //Article page
  app.get("/article", function (req, res) {
    var string = "select * from article";
    var title = "Article Title";
    var author = "vicancy";
    var content = "Article content here";
    sql.query(conn, string, function (err, items) {
      if (err) {
        throw err;
      }
      //console.log(items);
      res.render('article', {title: title, author: author, content: content});
    });
  });

  //Settings page
  app.get("/settings", function (req, res) {
    var notebooks = "select * from account";
    var title = "Settings";
    sql.query(conn, notebooks, function (err, items) {
      if (err) {
        throw err;
      }

      //console.log(items);
      res.render('settings', {title: title, tasks: items});
    });
  });

  //Writer page
  app.get("/writer", function (req, res) {
    var notebooks = "select * from notebook";
    var title = "Write Everywhere";
    sql.query(conn, notebooks, function (err, items) {
      if (err) {
        throw err;
      }

      //console.log(items);
      res.render('writer', {title: title, tasks: items});
    });
  });
};