var notebookManager = require('../modules/notebook-manager'),
  cacheManager = require('../modules/cache-manager');

module.exports = function (app) {
  app.get("/article-list", function (req, res) {
    if (!req.session.user) {
      // Use is not logged-in and redirect back to login page
      res.send("not authenticated.");
    } else {
      var userId = req.session.user._id;
      cacheManager.getAvailableArticles({
        'userId' : userId,
        'count' : 10 //Get top 10 of all the articles
      }, function (err, items) {
        if (err) {
          throw err;
        }
        if (items) {
          res.render('article-list', {items: items});
        }
      });
    }
  });

  //Detailed article page
  //One Extension of chrome always require jquery.ui.min.css, disable the chrome extension to avoid influencing this router
  /*
  { _id: 1,
    Address: '1B1E066A-AF7C-4E91-8506-6D4826000960',
    UserId: 1,
    LastUpdatedDate: '2013-08-08 11:00',
    NotebookName: 'My Notebook',
    NotebookId: 1,
    Title: '“Test for update 2”',
    Content: '## b\n',
    Preview: '<h3>de block \n\n',
    Abstract: '###  a blockquote\n\n' },
  */
  app.get('/articles/:title', function (req, res) {
    console.log(req.params);
    var title = req.params.title;
    cacheManager.getArticleContentByAddress(title, function (err, article) {
      if (err) {
        throw err;
      }

      var user = (req.session.user === undefined) ? null : req.session.user;
      if (article) {
        res.render('article',
          {
            user: user,
            article: article
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

      var user = req.session.user === undefined ? null : req.session.user;
      if (items.length === 0) {
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
};

