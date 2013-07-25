var sql = require('msnodesql')
	, nconf = require('nconf');

nconf.env()
	 .file({ file: 'config.json'});
var conn = nconf.get("SQL_CONN");


exports.index = function(req, res){
	var select = "select * from notebook";
	sql.query(conn, select, function(err, items){
		if(err){
			throw err;
		}
		res.render('index', {title: 'My NoteBooks', task: items})
	})
};
