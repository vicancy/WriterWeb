var express = require("express"),
  crypto = require('crypto'),
  nconf = require('nconf'),
  sql = require('msnodesql'),
  app = express();

nconf.env()
     .file({ file: 'config.json'});

var conn = nconf.get("SQL_Local");

app.configure('production', function () {
        conn = nconf.get("SQL_Azure");
     });

//callback(err, items)
exports.query = function (query, callback) {
  console.log(query);
  sql.query(conn, query, function (err, items) {
    callback(err, items);
  });
};

//callback(err)
exports.insert = function (query, callback) {
  console.log(query);
  sql.query(conn, query, function (err, items) {
    callback(err);
  });
};

exports.exec = function (query, callback) {
  console.log(query);
  sql.query(conn, query, function (err, items) {
    callback(err);
  });
};