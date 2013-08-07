var databaseManager = require('./database-manager'),
    cacheManager = require('./cache-manager');

//callback(err, notebooks)
exports.getTop5AvailableNotebooks = function (userId, callback) {

  var sp = "public_notebook_get_available_notebooks";
  var params = {
    'user_id' : userId,
    'count' : 5
  };

  databaseManager.exec(sp, params, function (err, items) {
    if (items.length < 1) {
      err = "Should have at least one default notebook for user :" + userId;
    }

    callback(err, items);
  });
};

//callback(err, notebooks)
exports.getAvailableNotebooks = function (userId, callback) {

  var sp = "public_notebook_get_available_notebooks";
  var params = {
    'user_id' : userId
  };

  databaseManager.exec(sp, params, function (err, items) {
   if (items.length < 1) {
     err = "Should have at least one default notebook for user :" + userId;
   }

   callback(err, items);
  });
};

//callback(err, articles)
exports.getTop10AvailableArticles = function (userId, callback) {
  var sp = "public_article_get_available_articles";
  var params = {
    'user_id' : userId,
    'count' : 10
  };

  databaseManager.exec(sp, params, callback);
};

//callback(err, articles)
exports.getAvailableArticlesByNotebookIdFromDatabase = function (parameters, callback) {

  var sp = "public_article_get_available_articles";
  var params = {
    'user_id' : parameters.userId,
    'notebook_id' : parameters.notebookId
  };

  databaseManager.exec(sp, params, callback);
};

//callback(err, article)
exports.getArticleContentFromDatabase = function (articleId, callback) {

  var sp = "public_article_get_article_detail_by_id";
  var params = {
    'article_id' : articleId
  };

  databaseManager.exec(sp, params, function (err, items) {
    if (items.length > 1) {
      err = "Article is not Unique! ArticleId = " + articleId;
    }
    else if (items.length < 1) {
      err = "No article exists with articleId = " + articleId;
    }

    callback(err, items[0]);

  });
};

//callback(err, article)
exports.getArticleContentByAddressFromDatabase = function (address, callback) {

  var sp = "public_article_get_article_detail_by_address";
  var params = {
    'nvc_unique_address' : address
  };

  databaseManager.exec(sp, params, function (err, items) {
    if (items.length > 1) {
      err = "Address is not Unique! Address = " + address;
    }
    else if (items.length < 1) {
      err = "No article exists with Address = " + address;
    }

    callback(err, items[0]);

  });
};

//callback(err)
exports.createArticleWithTemplateToDatabase = function (params, callback) {
  var title = "Untitled";

  //return getAvailableArticlesByNotebookId
  var sp = "public_article_add_new_article";
  var parameters = {
    'i_notebook_id' : params.notebookId,
    'nvc_article_title' : "Untitled",
    'i_account_id' : params.userId
  };

  databaseManager.exec(sp, parameters, callback);
};

exports.updateArticleToDatabase = function (article, callback) {
  //If not exists, insert into the table
  //If exists, update the article table and insert into the article revision table

  var sp = "public_article_get_article_detail_by_address";
  var params = {
    'nvc_unique_address' : address
  };

  databaseManager.exec(sp, params, function (err, items) {});
};

/* private helper methods */
