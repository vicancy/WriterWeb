var cache = require('memory-cache'),
    notebookManager = require('./notebook-manager');

exports.saveArticleContentToCache = function (articleId, article, callback) {
  cache.put(articleId, article);
};

exports.getArticleContentFromCache = function (articleId, callback) {
  var article = cache.get(articleId);
  if (!article) {
    notebookManager.getArticleContentFromDatabase(articleId, callback);
  } else {
    console.log("cache-manager.js L13 ", article);
    callback(null, article);
  }
};
