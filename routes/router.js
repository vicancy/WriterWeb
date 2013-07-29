var nconf = require('nconf'),
  sql = require('msnodesql');

nconf.env()
     .file({ file: 'config.json'});

var conn = nconf.get("SQL_CONN");

module.exports = function (app) {

  //Home page
  app.get("/", function (req, res) {
    var notebooks = "select * from notebook";
    var title = "My Notebook";
    sql.query(conn, notebooks, function (err, items) {
      if (err) {
        throw err;
      }

      console.log(items);
      res.render('index', {title: title, tasks: items});
    });
  });

  //Article page
  app.get("/article", function (req, res) {
    var string = "select * from article";
    var title = "Article Title";
    var author = "vicancy";
    var content = "Article content here";
    sql.query(conn, string, function (err, items) {
      if (err) {
        throw err;
      }
      console.log(items);
      res.render('article', {title: title, author: author, content: content});
    });
  });

  //Settings page
  app.get("/settings", function (req, res) {
    var notebooks = "select * from account";
    var title = "Settings";
    sql.query(conn, notebooks, function (err, items) {
      if (err) {
        throw err;
      }

      console.log(items);
      res.render('settings', {title: title, tasks: items});
    });
  });

  //Writer page
  app.get("/writer", function (req, res) {
    var notebooks = "select * from notebook";
    var title = "Write Everywhere";
    sql.query(conn, notebooks, function (err, items) {
      if (err) {
        throw err;
      }

      console.log(items);
      res.render('writer', {title: title, tasks: items});
    });
  });
};