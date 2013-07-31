var crypto = require('crypto'),
  moment = require('moment'),
  databaseManager = require('./database-manager');

/* login validation methods */

exports.autoLogin = function (user, pass, callback) {
  var query = "select i_account_id as '_id', nvc_account_name as 'user', nvc_account_password as 'pwd' from account where nvc_account_name= '" + user + "' and nvc_account_password ='" + pass + "'";
  databaseManager.query(query, function (err, items) {
    if (err){
      throw err;
    }

    if (items && items[0]) {
      callback({_id: items[0]._id, user: items[0].user, pass: items[0].pwd});
    } else {
      callback(null);
    }
  });
};

exports.manualLogin = function (user, pass, callback) {
  var query = "select i_account_id as '_id', nvc_account_name as 'user', nvc_account_password as 'pwd' from account where nvc_account_name= '" + user + "'";
  databaseManager.query(query, function (err, items) {
    if (err) {
      throw err;
    }
    if (items && items[0]) {
      var password = items[0].pwd;
      //console.log("pass: {0}, password: {1}", pass, password);
      validatePassword(pass, password, function (err, res) {
        if (res) {
          callback(null, {_id: items[0]._id, user: items[0].user, pass: items[0].pwd});
        } else {
          callback('invalid-password');
        }
      });
    } else {
      callback('user-not-found');
    }
  });
};

/* record insertion, update & deletion methods */
exports.addNewAccount = function (newData, callback) {
  var user = newData.user;
  var password = newData.password;
  var description = newData.description;
  var query = "select nvc_account_name as 'user' from account where nvc_account_name= '" + user + "'";


  databaseManager.query(query, function (err, items) {
    if (err) {
      throw err;
    }
    if (items && items[0]) {
      callback('username-taken');
    } else {
      saltAndHash(newData.password, function (hash) {
        newData.password = hash;
        // append date stamp when record was created //
        newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
        /*jslint es5: true */
        var insert = " \
              INSERT INTO [dbo].[account] \
             ([nvc_account_name] \
             ,[nvc_account_description] \
             ,[nvc_account_password]) \
             VALUES \
             ('" + user + "', '" + description + "', '" + newData.password + "')";
        databaseManager.insert(insert, callback);
      });
    }
  });
};


//callback(err, account)
exports.getUserInfo = function (userId, callback) {
  /*jslint es5: true */
  var query = "select i_account_id as '_id', \
  nvc_account_name as 'user' \
  from account where i_account_id = " + userId;
  console.log("account-manager.js L81 : ", query);
  databaseManager.query(query, function (err, items) {
    if (items.length > 1) {
      err = "More than one user when userId = " + userId;
    } else if (items.length < 1) {
      err = "User not exists when userId = " + userId;
    }

    console.log("account-manager.js L89 ", items);
    callback(err, items);
  });
}

exports.updateAccount = function(newData, callback)
{
}

exports.updatePassword = function(email, newPass, callback)
{
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
}

exports.getAccountByEmail = function(email, callback)
{
}

exports.validateResetLink = function(email, passHash, callback)
{
}

exports.getAllRecords = function(callback)
{
};

exports.delAllRecords = function(callback)
{
}

/* private encryption & validation methods */

var generateSalt = function()
{
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var salt = '';
  for (var i = 0; i < 10; i++) {
    var p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
}

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  console.log(validHash);
  callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
  return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
  accounts.findOne({_id: getObjectId(id)},
    function(e, res) {
    if (e) callback(e)
    else callback(null, res)
  });
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
  accounts.find( { $or : a } ).toArray(
    function(e, results) {
    if (e) callback(e)
    else callback(null, results)
  });
}
