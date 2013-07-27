var nconf = require('nconf'),
  sql = require('msnodesql');

nconf.env()
     .file({ file: 'config.json'});

var conn = nconf.get("SQL_CONN");

exports.article = function (req, res) {
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
};

