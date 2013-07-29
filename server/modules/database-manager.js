var crypto = require('crypto'),
  nconf = require('nconf'),
  sql = require('msnodesql');

nconf.env()
     .file({ file: 'config.json'});

var conn = nconf.get("SQL_CONN");

//callback(err, items)
exports.query = function (query, callback) {
  //console.log(query);
  sql.query(conn, query, function (err, items) {
    callback(err, items);
  });
};

//callback(err)
exports.insert = function (query, callback) {
  //console.log(query);
  sql.query(conn, query, function (err, items) {
    callback(err);
  });
};