var crypto = require('crypto'),
  nconf = require('nconf'),
  sql = require('msnodesql');

nconf.env()
     .file({ file: 'config.json'});

var conn = nconf.get("SQL_CONN");

exports.query = function (query, callback) {
  console.log(query);
  sql.query(conn, query, function (err, items) {
    if (err) {
      throw err;
    }
    if (items) {
      callback(items);
    } else {
      callback(null);
    }
  });
};

exports.insert = function (query, callback) {
  console.log(query);
  sql.query(conn, query, function (err, items) {
    if (err) {
      throw err;
    }
    console.log(items);
    if (items) {
      callback(items);
    } else {
      callback(null);
    }
  });
};