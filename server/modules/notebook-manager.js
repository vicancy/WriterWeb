var databaseManager = require('./database-manager');

//callback(err, notebooks)
exports.getTop5AvailableNotebooks = function (userId, callback) {
  var query = "select top 5 i_notebook_id as '_id', nvc_notebook_name as 'name', nvc_notebook_description as 'description' from notebook where i_account_id = " + userId + " order by i_article_count desc";
  console.log("notebook-manager.jsL6", query);
  databaseManager.query(query, function (err, items) {
    callback(err, items);
  });
};

//callback(err, notebooks)
exports.getAvailableNotebooks = function (userId, callback) {
  var query = "select i_notebook_id as '_id', nvc_notebook_name as 'name', nvc_notebook_description as 'description' from notebook where i_account_id = " + userId + " order by i_article_count desc";
  console.log("notebook-manager.js L15 ", query);
  databaseManager.query(query, function (err, items) {
    callback(err, items);
  });
};

//callback(err, articles)
exports.getTop10AvailableArticles = function (userId, callback) {
  /*jslint es5: true */
  var query = "select top 10 a.i_article_id as '_id', \
  a.nvc_unique_address as 'Address', \
  Case \
    When a.dt_modified_datetime is null THEN convert(nvarchar(16), a.dt_inserted_datetime, 120) \
    ELSE convert(nvarchar(16), a.dt_modified_datetime, 120) \
  END \
  AS 'LastUpdatedDate', \
  nb.nvc_notebook_name as 'NotebookName', av.nvc_article_title as 'Title', \
  av.nvc_article_abstract as 'Abstract' \
  from article a \
  join notebook nb \
  on a.i_notebook_id = nb.i_notebook_id \
  join article_version av \
  on a.i_latest_version_id = av.i_version_id and a.i_article_id = av.i_article_id \
  where nb.i_account_id = " + userId + " order by a.dt_modified_datetime desc";
  console.log("notebook-manager.jsL30", query);
  databaseManager.query(query, function (err, items) {
    console.log(items);
    callback(err, items);
  });
};

//callback(err, article)
exports.getArticleContent = function (articleId, callback) {
  /*jslint es5: true */
  var query = "select a.i_article_id as '_id', \
  a.nvc_unique_address as 'Address', \
  nb.i_account_id as 'UserId', \
  Case \
    When a.dt_modified_datetime is null THEN convert(nvarchar(16), a.dt_inserted_datetime, 120) \
    ELSE convert(nvarchar(16), a.dt_modified_datetime, 120) \
  END \
  AS 'LastUpdatedDate', \
  nb.nvc_notebook_name as 'NotebookName', av.nvc_article_title as 'Title', \
  av.nvc_article_content as 'Content' \
  from article a \
  join notebook nb \
  on a.i_notebook_id = nb.i_notebook_id \
  join article_version av \
  on a.i_latest_version_id = av.i_version_id and a.i_article_id = av.i_article_id \
  where a.i_article_id = " + articleId;
  console.log("notebook-manager.jsL53", query);
  databaseManager.query(query, function (err, items) {
    console.log(items);
    callback(err, items);
  });
};

//callback(err, article)
exports.getArticleContentByAddress = function (address, callback) {
  /*jslint es5: true */
  var query = "select a.i_article_id as '_id', \
  a.nvc_unique_address as 'Address', \
  nb.i_account_id as 'UserId', \
  Case \
    When a.dt_modified_datetime is null THEN convert(nvarchar(16), a.dt_inserted_datetime, 120) \
    ELSE convert(nvarchar(16), a.dt_modified_datetime, 120) \
  END \
  AS 'LastUpdatedDate', \
  nb.nvc_notebook_name as 'NotebookName', av.nvc_article_title as 'Title', \
  av.nvc_article_content as 'Content' \
  from article a \
  join notebook nb \
  on a.i_notebook_id = nb.i_notebook_id \
  join article_version av \
  on a.i_latest_version_id = av.i_version_id and a.i_article_id = av.i_article_id \
  where a.nvc_unique_address = '" + address + "'";
  console.log("notebook-manager.jsL82", query);
  databaseManager.query(query, function (err, items) {
    if (items.length > 1) {
      err = "Address is not Unique! Address = " + address;
    }
    console.log("notebook-manager.js L86 ", items);
    callback(err, items);
  });
};