
var notebookManager = require('./modules/notebook-manager'),
  accountManager = require('./modules/account-manager'),
  cacheManager = require('./modules/cache-manager');

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
        //res.render('login', {title: 'Account not found, please try again.' });
        //res.redirect('/home');
        res.send(e, 400);
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
    console.log(req.session.user);
    if (!req.session.user) {
      console.log(req.session.user);
      // Use is not logged-in and redirect back to login page
      res.redirect('/');
    } else {
      var userId = req.session.user._id;
      notebookManager.getTop5AvailableNotebooks(userId, function (err, items) {
        if (err) {
          throw err;
        }

        if (items) {
          res.render('index', {title: 'My Notebook', user: req.session.user, tasks: items});
        }
      });
    }
  });

  app.get("/article-list", function (req, res) {
    console.log(req.session);
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.send("not authenticated.");
    } else {
      var userId = req.session.user._id;
      cacheManager.getTop10AvailableArticles(userId, function (err, items) {
        if (err) {
          throw err;
        }
        if (items) {
          res.render('article-list', {items: items});
        }
      });
    }
  });


  app.get("/editable-article-list", function (req, res) {
    console.log(req.session);
    console.log(req.session.user);
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.send("not authenticated.");
    } else {
      var params = {
        userId : req.session.user._id,
        notebookId : req.param('notebookId'),
        action : req.param('action')
      };
      if (params.action && params.action === 'create') {
        cacheManager.createArticleWithTemplate(params, function (err, items) {
          if (err) {
            throw err;
          }
          console.log(items);
          if (items) {
            res.render('editable-article-list',
            {
              items: items,
              selectedArticleId: items[0]._id
            });
          }
        });
      } else {
        notebookManager.getAvailableArticlesByNotebookIdFromDatabase(params, function (err, items) {
          if (err) {
            throw err;
          }

          if (items) {
            res.render('editable-article-list',
            {
              items: items,
              selectedArticleId: items[0]._id
            });
          }
        });
      }
    }
  });

  app.get("/editable-article", function (req, res) {
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.send("not authenticated.");
    } else {
      var userId = req.session.user._id;
      var articleId = req.param('articleId');
      var action = req.param('action');
      if (action && action === 'create') {
        //Seems not needed, created ones are empty ones with def
      } else {
        cacheManager.getArticleContent(articleId, function (err, item) {
          if (err) {
            throw err;
          }
          console.log(item);
          if (item) {
            res.send(
              {
                markdown :item.Content,
                html : item.Preview
              });
          } else {
            res.send(200);
          }
        });
      }
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
      description: req.param('description'),
      nickname: req.param('name'),
      email: req.param('email')
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
        console.log(items[0]._id);
        res.render('writer', {
          user: req.session.user,
          title: "Writer's Page",
          notebooks: items,
          selectedNotebookId: items[0]._id
        });
      });
    }
  });

  //Save article to database
  app.post("/writer", function (req, res) {
    var params = {
      articleId : req.param('article'),
      markdown : req.param('markdown'),
      html : req.param('html')
    };
    cacheManager.updateArticle(params, function (e) {
      if (e) {
        res.send(e, 400);
      } else {
        res.send('ok', 200);
      }
    });
  });

  //Detailed article page
  //One Extension of chrome always require jquery.ui.min.css, disable the chrome extension to avoid influencing this router
  app.get('/articles/:title', function (req, res) {
    console.log(req.params);
    var title = req.params.title;
    cacheManager.getArticleContentByAddress(title, function (err, article) {
      if (err) {
        throw err;
      }

      var user = typeof(req.session.user) == 'undefined' ? null : req.session.user;
      if (article) {
        res.render('article',
        {
          user: user,
          title: article.Title,
          content: article.Preview,
          lastUpdatedDate: article.LastUpdatedDate,
          notebook: article.NotebookName
        });
      } else {
        res.render('NotFound', { title: 'Article Not Found!', user: user});
      }
    });
  });

  //Detailed article page
  app.get('/articles/:id', function (req, res) {
    var id = req.params.id;
    cacheManager.getArticleContent(id, function (err, items) {
      if (err) {
        throw err;
      }

      var user = typeof(req.session.user) == 'undefined' ? null : req.session.user;
      if (items.length === 0) {
          res.render('NotFound', { title: 'Article Not Found!', user: user});
      } else {
        res.render('article',
        {
          user: user,
          title: items[0].Title,
          content: items[0].Content,
          lastUpdatedDate: items[0].LastUpdatedDate,
          notebook: items[0].NotebookName,
        });
      }
    });
  });

  //Detailed article page
  //One Extension of chrome always require jquery.ui.min.css, disable the chrome extension to avoid influencing this router
  app.get('/writer/:title', function (req, res) {
    var title = req.params.title;
  });

  //Detailed article page
  //One Extension of chrome always require jquery.ui.min.css, disable the chrome extension to avoid influencing this router
  app.get('/writer/:id', function (req, res) {
    var id = req.params.id;
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.redirect('/');
    } else {
      var userId = req.session.user._id;
      //Make sure articleId = id is an article that this user have permission to edit



    }
  });

  app.get('/env', function (req, res) {
    res.send(process.env);
  });

};