
var notebookManager = require('./modules/notebook-manager'),
  accountManager = require('./modules/account-manager'),
  read = require('./routers/read'),
  write = require('./routers/write'),
  cacheManager = require('./modules/cache-manager');

module.exports = function (app) {

  //Login page
  app.get("/", function (req, res) {
    //check if the user's credentials are saved in a cookie
    if (req.cookies && req.cookies.user && req.cookies.pass) {
      //try automatic login
      accountManager.login(req.cookies.user, req.cookies.pass, function (e, items) {
        console.log(e);
        //Set this user to current session
        if (e) {
          res.send(e, 400);
        } else {
          req.session.user = items[0];
          res.redirect('/home');
        }
      });
    } else {
      res.render('login', { title: 'Please Login To Your Account' });
    }
  });

  //Type in user/password and submit to login
  app.post('/', function (req, res) {
    accountManager.login(req.param('user'), req.param('pass'), function (e, items) {
      if (e) {
        res.send(e, 400);
      } else {
        var user = items[0];
        req.session.user = user;
        if (req.param('remember-me') === 'true') {
          var hour = 3600000;
          res.cookie('user', user.Name, {maxAge: 14 * 24 * hour }); // keep for 2 weeks
          res.cookie('pass', user.Password, {maxAge: 14 * 24 * hour });
        }

        res.redirect('/home');
      }
    });
  });

  //Home page
  /*
  req.session.user :  { _id: 10,
  Name: 'reader3@173.com',
  Description: 'reader3@173.com',
  Password: 'aUrp88e4Jm4a50c90b4eda6ab825a52a190f5696fb',
  Email: 'reader3@173.com',
  Nickname: 'reader3',
  Details: null }

  items : [ { _id: 2, name: 'My Notebook', description: null } ]
  */
  app.get("/home", function (req, res) {
    console.log("/home req.session.user : ", req.session.user);
    if (!req.session.user) {
      console.log(req.session.user);
      // Use is not logged-in and redirect back to login page
      res.redirect('/');
    } else {
      var user = req.session.user;
      notebookManager.getTop5AvailableNotebooks(user._id, function (err, items) {
        if (err) {
          throw err;
        }

        console.log (items);
        if (items) {
          var params = {
            title: user.Nickname + ' - Write Everywhere',
            user: user,
            notebooks: items
          };
          res.render('index', params);
        }
      });
    }
  });

  /*
  Read's Router:
    * "/article-list"
  */
  read(app);

  /*
  Write's Router:
    * "/editable-article-list"
    * "/editable-article"
  */
  write(app);

  //Signup page
  app.get("/signup", function (req, res) {
    res.render('signup', {
      title: 'Signup'
    });
  });

  //callback (e, user)
  app.post('/signup', function (req, res) {
    accountManager.addNewAccount({
      user: req.param('user'),
      password: req.param('pass'),
      description: req.param('description'),
      nickname: req.param('name'),
      email: req.param('email')
    }, function (e, items) {
      console.log(e);
      //Set this user to current session
      if (e) {
        res.send(e, 400);
      } else if (items.length !== 1) {
        res.send("More than one user return when create user!", 400);
      } else {
        req.session.user = items[0];
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
        console.log(err);
        if (err) {
          res.send(err, 400);
        } else {
          req.session.user = items[0];
          res.render('settings', {title: "Settings", user: items[0]});
        }
      });
    }
  });


  app.get('/env', function (req, res) {
    res.send(process.env);
  });

};