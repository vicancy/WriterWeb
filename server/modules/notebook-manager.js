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
exports.getTop10AvailableArticlesFromDatabase = function (userId, callback) {
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

  var sp = "public_article_update_article";
  var params = {
    'i_article_id' : article._id,
    'i_modified_by_account_id' : article.UserId,
    'nvc_article_title' : article.Title,
    'nvc_article_abstract' : article.Abstract,
    'nvc_article_content' : article.Content,
    'nvc_article_preview' : article.Preview,
    'i_notebook_id' : article.NotebookId
  };

  databaseManager.exec(sp, params, callback);
};

//return abstract
exports.getAbstractFromContent = function (content) {
  var abstract;
  if (typeof(content) !== 'string') {
    abstract = '';
  } else if (content.length < 200) {
    abstract = content;
  } else {
    abstract = content.substring(0, 200);
  }

  return abstract;
};

/* private helper methods */
