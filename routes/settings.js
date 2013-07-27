var nconf = require('nconf'),
  sql = require('msnodesql');

nconf.env()
     .file({ file: 'config.json'});

var conn = nconf.get("SQL_CONN");

exports.settings = function (req, res) {
  var string = "select * from account";
  var title = "Write Everywhere";
  sql.query(conn, string, function (err, items) {
    if (err) {
      throw err;
    }

    console.log(items);
    res.render('settings', {title: title, tasks: items});
  });
};

