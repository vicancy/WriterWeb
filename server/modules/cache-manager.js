var cache = require('memory-cache'),
    idAddressMapping = require('memory-cache'),
    notebookManager = require('./notebook-manager');

/* params
{
    articleId : articleId,
    article : article,
    address : ""
}
*/
//callback(msg)
var saveArticleContentToCache = function (params, callback) {
  if (params.address) {
    idAddressMapping.put(params.address, params.articleId);
  }

  cache.put(params.articleId, params.article);
  console.log("cache-manager.js L8 ", params.article);
};

exports.saveArticleContentToCache = saveArticleContentToCache;

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
  saveArticleContentToCache({
    articleId : params.articleId,
    article : article
  }, callback);
};

//callback(err, article)
exports.getArticleContent = function (articleId, callback) {
  var article = cache.get(articleId);
  console.log("cache-manager.js L26 ", article);
  if (article) {
    callback(null, article);
  } else {
    notebookManager.getArticleContentFromDatabase(articleId, function (err, item) {
      if (err) {
        throw err;
      }

      if (item) {
        saveArticleContentToCache({
          articleId : articleId,
          article : item
        });
      }

      callback(err, item);

    });
  }
};

//callback(err, article)
exports.getArticleContentByAddress = function (address, callback) {
  var articleId = idAddressMapping.get(address);
  if (articleId) {
    var article = cache.get(articleId);
    if (article) {
      console.log("cache-manager.js L28 ", article);
      callback(null, article);
    } else {
      notebookManager.getArticleContentFromDatabase(articleId, function (err, item) {
        if (err) {
          throw err;
        }

        if (item) {
          saveArticleContentToCache({
            articleId : articleId,
            article : item
          });
        }

        callback(err, item);

      });
    }
  } else {
      notebookManager.getArticleContentByAddressFromDatabase(address, function (err, item) {
        if (err) {
          throw err;
        }

        if (item) {
          saveArticleContentToCache({
            articleId : item._id,
            article : item,
            address : address
          });
        }

        callback(err, item);

      });
  }
};

exports.createArticleWithTemplate = function (params, callback) {
  notebookManager.createArticleWithTemplateToDatabase(params, function (err, items) {
    if (err) {
      throw err;
    }

    if (items) {
      for (var item in items) {
        saveArticleContentToCache({
            articleId : item.articleId,
            article : item
          });
      }
    }

    callback(err, items);
  });
};

exports.saveCacheToDatabase = function (params, callback) {

};