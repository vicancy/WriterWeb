var cache = new memoryCacheObject(),
    idAddressMapping = new memoryCacheObject(),
    articleTimeStamp = new memoryCacheObject(),
    notebookManager = require('./notebook-manager');

function now() { return (new Date()).getTime(); }

/* params
{
    articleId : articleId,
    article : article,
    address : ""
}
*/
//callback(msg)
var saveArticleContentToCache = function (params, callback) {
  console.log("saveArticleContentToCache", params);
  if (!params.articleId) throw "Invalid ArticleId";
  var id = parseInt(params.articleId);
  if (!params.article.Address) throw "Should NOT " + params.article.Address;
  //Only update mode would update the updated timestamp of article(stands for the last modified time)
  if (params.action && params.action === 'update') {
    idAddressMapping.put(params.article.Address, id);
  }
  cache.put(id, params.article);
  //Put current timestamp into cache
  articleTimeStamp.put(id, now());
  if (callback) callback(null);
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
  //If have changes, update cache
  //Add !article.Content for : TypeError: Cannot read property 'Content' of null

  console.log("updateArticle: ", article, params, cache.items());
  if (article && !article.Content || params.markdown !== article.Content) {
    article.Content = params.markdown;
    article.Preview = params.html;
    article.Abstract = notebookManager.getAbstractFromContent(article.Content);
    console.log("have changes, updating ", article);
    saveArticleContentToCache({
      articleId : params.articleId,
      article : article,
      action : 'update'
    }, callback);
  }
};

//callback(err, articles)
/*
var params = {
  'user_id' : parameters.userId,
  'notebook_id' : parameters.notebookId,
  'count' : parameters.count
};
*/
exports.getAvailableArticles = function (params, callback) {
  notebookManager.getAvailableArticlesFromDatabase(params, function (err, articles) {
    articles.forEach(function (article) {
      var cachedArticle = cache.get(article._id);
      console.log("getAvailableArticles", article, cachedArticle, cache.items());
      if (cachedArticle) {
        article.Abstract = cachedArticle.Abstract;
        article.LastUpdatedDate = cachedArticle.LastUpdatedDate;
        article.NotebookName = cachedArticle.NotebookName;
        article.Title = cachedArticle.Title;
      }
    });
    callback(err, articles);
  });
};

//callback(err, article)
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
exports.getArticleContent = function (articleId, callback) {
  var article = cache.get(articleId);
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
          article : item,
          action : 'get'
        });
      }

      callback(err, item);

    });
  }
};

//callback(err, article)
exports.getArticleContentByAddress = function (address, callback) {
  console.log("getArticleContentByAddress", idAddressMapping.items());
  var articleId = idAddressMapping.get(address);
  if (articleId) {
    var article = cache.get(articleId);
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
            article : item,
            action : 'get'
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
            action : 'get'
          });
        }

        callback(err, item);

      });
  }
};

//callback(err)
exports.createArticleWithTemplate = function (params, callback) {
  notebookManager.createArticleWithTemplateToDatabase(params, callback);
};

/*
{ _id: 28,
  Address: '9AA43F78-4412-4B42-BB1B-456F4FE630D6',
  UserId: 1,
  LastUpdatedDate: '2013-08-07 17:19',
  NotebookName: 'My Notebook',
  NotebookId: 1,
  Title: 'Untitled',
  Content: 'asd',
  Preview: '<p>asd</p>\n',
  Abstract: 'asd'
}
*/
exports.saveCacheToDatabase = function (lastUpdateTime, callback) {
  //Save articles to database if changed (timestamp is earlier than last update time)
  if (cache.size() > 0) {
    for (var key in cache.items()) {
      var item = cache.get(key);
      var timeStamp = articleTimeStamp.get(key);
      console.log('lastUpdateTime : ', lastUpdateTime, "compare to article's cached time stamp : ", timeStamp);
      if (lastUpdateTime < timeStamp) {
        console.log("notebookManager.updateArticleToDatabase ", item);
        notebookManager.updateArticleToDatabase(item, function () {
          console.log((new Date()).toTimeString(), " saved to database ");
          console.log("updating articleTimeStamp from timeStamp = ", timeStamp, " to lastUpdateTime = ", lastUpdateTime);
          articleTimeStamp.put(key, lastUpdateTime);
        });
      }
    }

    callback();
  }
};


/* Closure for memoryCache object */
function memoryCacheObject () {
  var cache = {};
  function now() { return (new Date()).getTime(); }
  var debug = false;
  var hitCount = 0;
  var missCount = 0;

  this.put = function (key, value, time, timeoutCallback) {
    if (debug) console.log('caching: ', key, ' = ', value, ' (@', time, ')');
    var oldRecord = cache[key];
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
    }

    var expire = time + now();

    var record = {value: value, expire: expire};

    if (!isNaN(expire)) {
      var timeout = setTimeout(function() {
        exports.del(key);
        if (typeof timeoutCallback === 'function') {
          timeoutCallback(key);
        }
      }, time);
      record.timeout = timeout;
    }

    if (debug) console.log('cached : ', record);
    cache[key] = record;
  };

  function del(key) {
    delete cache[key];
  }

  function clear() {
    cache = {};
  }

  this.get = function (key) {
    var data = cache[key];
    if (typeof data != "undefined") {
      if (isNaN(data.expire) || data.expire >= now()) {
        if (debug) hitCount++;
        return data.value;
      } else {
        // free some space
        if (debug) missCount++;
        del(key);
      }
    }
    return null;
  };

  this.size = function () {
    var size = 0, key;
    for (key in cache) {
      if (cache.hasOwnProperty(key))
        if (this.get(key) !== null)
          size++;
    }
    return size;
  };

  function memsize() {
    var size = 0, key;
    for (key in cache) {
      if (cache.hasOwnProperty(key))
        size++;
    }
    return size;
  }

  function debug(bool) {
    debug = bool;
  }

  function hits() {
    return hitCount;
  }

  function misses() {
    return missCount;
  }

  this.items = function() {
    return cache;
  };

}