var cache = require('memory-cache'),
    idAddressMapping = require('memory-cache'),
    notebookManager = require('./notebook-manager');

exports.saveArticleContentToCache = function (articleId, article, callback) {
  cache.put(articleId, article);
};

exports.saveIdAddressMappingToCache = function (articleId, address, callback) {
  idAddressMapping.put(articleId, address);
};

//callback(err, article)
exports.getArticleContentFromCache = function (articleId, callback) {
  var article = cache.get(articleId);
  if (article) {
    console.log("cache-manager.js L13 ", article);
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
