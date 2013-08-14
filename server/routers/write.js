var notebookManager = require('../modules/notebook-manager'),
  cacheManager = require('../modules/cache-manager');


module.exports = function (app) {
  app.get("/editable-article-list", function (req, res) {
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.send("not authenticated.");
    } else {
      var params = {
        userId : req.session.user._id,
        notebookId : req.param('notebookId'),
      };

      var action = req.param('action');
      if (action && action === 'create') {
        cacheManager.createArticleWithTemplate(params, function (err) {
          if (err) {
            throw err;
          }

          getAvailableArticles(params, res);
        });
      } else {
        getAvailableArticles(params, res);
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
                title : item.Title,
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
      title : req.param('title'),
      html : req.param('html'),
      mode : req.param('mode'),
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
  app.get('/writer/:id', function (req, res) {
    var id = req.params.id;
    if (typeof(id) !== 'number') {
      //next();
    }
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.redirect('/');
    } else {
      var userId = req.session.user._id;
      var user = typeof(req.session.user) == 'undefined' ? null : req.session.user;
      cacheManager.getArticleContent(id, function (err, item){
        if (err) {
          throw err;
        }

        if (!item) {
          res.render('NotFound', { title : 'Article Not Found !', user : user});
        }

        //Make sure articleId = id is an article that this user have permission to edit
        if (userId !== item.UserId) {
          res.render('NotFound', { title : 'Article Belongs to Current User Not Found !', user : user});
        }

        res.send('ok', 200);
        /* TO BE MODIFIED
        res.render('writing-page', {
          title : "Purely Writing",
          article : item,
          selectedArticleId : item._id,
          mode : "fullscreen"
        });
        */
      });
    }
  });

  //Detailed article page
  //One Extension of chrome always require jquery.ui.min.css, disable the chrome extension to avoid influencing this router
  app.get('/writer/:title', function (req, res) {
    var title = req.params.title;
  });

};


/* Private helper functions */

var getAvailableArticles = function(params, res) {
  cacheManager.getAvailableArticles(params, function (err, items) {
    if (err) {
      throw err;
    }
    if (items && items.length > 0) {
      res.render('editable-article-list',
      {
        items: items,
        selectedArticleId: items[0]._id,
        mode : "subfield"
      });
    }
  });
};