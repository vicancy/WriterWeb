var nconf = require('nconf')
    ,sql = require('msnodesql'); 

nconf.env()
	 .file({ file: 'config.json'});
var conn = nconf.get("SQL_CONN");


exports.index = function(req, res){
	var select = "select * from notebook";
    var title = "My NoteBooks";
	sql.query(conn, select, function(err, items){
    	if(err){
			throw err;
		}
        console.log(select + title);
        console.log(items);
		res.render('index', {title: title, tasks: items});
	})
};

