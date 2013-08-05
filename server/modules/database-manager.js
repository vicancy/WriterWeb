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

//callback(err, items)
exports.exec = function (sp, params, callback) {
  var query = "EXEC [" + sp + "] ";
  for(var name in params) {
    var type = typeof(params[name]);
    console.log(type + " : " + params[name]);
    if (type === 'string') {
      query += "@" + name + "='" + params[name] + "',";
    } else if (type === 'number') {
      query += "@" + name + "=" + params[name] + ",";
    }
  }
  query = query.substring(0, query.length - 1) + ";";

  console.log(query);
  sql.query(conn, query, function (err, items) {
    callback(err, items);

  });
};