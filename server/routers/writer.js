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