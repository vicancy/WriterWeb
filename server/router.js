
var notebookManager = require('./modules/notebook-manager'),
  accountManager = require('./modules/account-manager');

module.exports = function (app) {

  //Login page
  app.get("/", function (req, res) {
    //check if the user's credentials are saved in a cookie
    if (req.cookies && req.cookies.user && req.cookies.pass) {
      //try automatic login
      accountManager.autoLogin(req.cookies.user, req.cookies.pass, function (o) {
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
      if (!o) {
        res.render('login', {title: 'Account not found, please try again.' });
        //res.redirect('/home');
      } else {
        req.session.user = o;
        if (req.param('remember-me') === 'true') {
          var hour = 3600000;
          res.cookie('user', o.user, {maxAge: 14 * 24 * hour }); // keep for 2 weeks
          res.cookie('pass', o.pass, {maxAge: 14 * 24 * hour });
        }

        res.redirect('/home');
        //res.send(o, 200);
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
      notebookManager.getTop5AvailableNotebooks(userId, function (err, items) {
        if (err) {
          throw err;
        }
        res.render('index', {title: 'My Notebook', user: req.session.user, tasks: items});
      });
    }
  });

  app.get("/article-list", function (req, res) {
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.send("not authenticated.");
    } else {
      var userId = req.session.user._id;
      notebookManager.getTop10AvailableArticles(userId, function (err, items) {
        if (err) {
          throw err;
        }

        res.render('article-list', {items: items});
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
      console.log(e);
      if (e) {
        res.send(e, 400);
      } else {
        res.send('ok', 200);
      }
    });
  });

  //Signout
  app.get("/signout", function (req, res) {
    req.session.user = null;
    res.clearCookie('user');
    res.clearCookie('pass');
    res.redirect('/');
  });

  //Settings page
  app.get("/settings", function (req, res) {
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.redirect('/');
    } else {
      var userId = req.session.user._id;
      accountManager.getUserInfo(userId, function (err, items) {
        if (err) {
          throw err;
        }

        res.render('settings', {title: "Settings", user: items[0]});
      });
    }
  });

  //Writer page
  app.get("/writer", function (req, res) {
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.redirect('/');
    } else {
      var userId = req.session.user._id;
      notebookManager.getAvailableNotebooks(userId, function (err, items) {
        if (err) {
          throw err;
        }

        res.render('writer', {
          user: req.session.user,
          title: "Writer's Page",
          notebooks: items
        });
      });
    }
  });

  //Detailed article page
  app.get('/articles/:title', function (req, res) {
    var title = req.params.title;
    notebookManager.getArticleContentByAddress(title, function (err, items) {
      if (err) {
        throw err;
      }

      var user = typeof(req.session.user) == 'undefined' ? null : req.session.user;
      if (items.length == 0) {
          res.render('NotFound', { title: 'Article Not Found!', user: user});
      } else {
        res.render('article',
        {
          user: user,
          title: items[0].Title,
          content: items[0].Content,
          lastUpdatedDate: items[0].LastUpdatedDate,
          notebook: items[0].NotebookName
        });
      }
    });
  });

  app.get('/env', function (req, res) {
    res.send(process.env);
  });

};