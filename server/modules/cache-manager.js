var cache = require('memory-cache'),
    idAddressMapping = require('memory-cache'),
    notebookManager = require('./notebook-manager');

//callback(msg)
exports.saveArticleContentToCache = function (articleId, article, callback) {
  cache.put(articleId, article);
  console.log("cache-manager.js L8 ", article);
};

/*
  var params = {
    articleId : req.param('article'),
    markdown : req.param('markdown'),
    html : req.param('html')
  };
*/
exports.updateArticle = function (params, callback) {
  var article = cache.get(params.articleId);
  article.Content = params.markdown;
  article.Preview = params.html;
  cache.put(params.articleId, article);
  callback(null);
};

exports.saveArticleContentToCacheWithAddress = function (address, articleId, article, callback) {
  idAddressMapping.put(articleId, address);
  cache.put(articleId, article);
};

//callback(err, article)
exports.getArticleContentFromCache = function (articleId, callback) {
  var article = cache.get(articleId);
  console.log("cache-manager.js L26 ", article);
  if (article) {
    callback(null, article);
  } else {
    notebookManager.getArticleContentFromDatabase(articleId, callback);
  }
};

//callback(err, article)
exports.getArticleContentByAddressFromCache = function (address, callback) {
  var id = idAddressMapping.get(articleId);
  if (id) {
    var article = cache.get(id);
    if (article) {
      console.log("cache-manager.js L28 ", article);
      callback(null, article);
    } else {
      notebookManager.getArticleContentFromDatabase(articleId, callback);
    }
  } else {
      notebookManager.getArticleContentByAddressFromDatabase(articleId, callback);
  }
};
