var nconf = require('nconf'),
  sql = require('msnodesql');

nconf.env()
     .file({ file: 'config.json'});

var conn = nconf.get("SQL_CONN");

exports.writer = function (req, res) {
  var notebooks = "select * from notebook";
  var title = "Write Everywhere";
  sql.query(conn, notebooks, function (err, items) {
    if (err) {
      throw err;
    }

    console.log(items);
    res.render('writer', {title: title, tasks: items});
  });
};

