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
};