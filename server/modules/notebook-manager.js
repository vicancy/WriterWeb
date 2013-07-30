var databaseManager = require('./database-manager');

//callback(err, notebooks)
exports.getTop5AvailableNotebooks = function (userId, callback) {
  var query = "select top 5 i_notebook_id as '_id', nvc_notebook_name as 'name', nvc_notebook_description as 'description' from notebook where i_account_id = " + userId + " order by i_article_count desc";
  console.log("notebook-manager.jsL6", query);
  databaseManager.query(query, function (err, items) {
    callback(err, items);
  });
};


//callback(err, articles)
exports.getTop10AvailableArticles = function (userId, callback) {
  /*jslint es5: true */
  var query = "select top 10 a.i_article_id as '_id', \
  Case \
    When a.dt_modified_datetime is null THEN a.dt_inserted_datetime \
    ELSE a.dt_modified_datetime \
  END \
  AS 'LastUpdatedDate', \
  nb.nvc_notebook_name as 'NotebookName', av.nvc_article_title as 'Title', av.nvc_article_abstract as 'Abstract', \
  av.nvc_article_content as 'Content' \
  from article a \
  join notebook nb \
  on a.i_notebook_id = nb.i_notebook_id \
  join article_version av \
  on a.i_latest_version_id = av.i_version_id and a.i_article_id = av.i_article_id \
  where nb.i_account_id = " + userId + " order by a.dt_modified_datetime desc";
  console.log("notebook-manager.jsL16", query);
  databaseManager.query(query, function (err, items) {
    console.log(items);
    callback(err, items);
  });
};


