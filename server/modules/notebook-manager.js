var databaseManager = require('./database-manager');

//callback(err, notebooks)
exports.getAvailableNotebooks = function (userId, callback) {
  var query = "select i_notebook_id as '_id', nvc_notebook_name as 'name', nvc_notebook_description as 'description' from notebook where i_account_id = " + userId;
  databaseManager.query(query, function (err, items) {
    callback(err, items);
  });
};
