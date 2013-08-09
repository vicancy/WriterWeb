var crypto = require('crypto'),
  moment = require('moment'),
  errorcode = require('./errorcode'),
  databaseManager = require('./database-manager');

/* login validation methods */

/*
req.session.user :  { _id: 10,
Name: 'reader3@173.com',
Description: 'reader3@173.com',
Password: 'aUrp88e4Jm4a50c90b4eda6ab825a52a190f5696fb',
Email: 'reader3@173.com',
Nickname: 'reader3',
Details: null }
*/
//callback(err, account[s])
exports.login = function (user, pass, callback) {

  var sp = "public_account_get_account";
  var params = {
    'nvc_account_name' : user,
    'vc_account_password' : pass
  };

  databaseManager.exec(sp, params, function (err, items) {
    //What err is thrown when username taken?
    err = errorcode.getErrorCode(err);
    if (!err) {
      if (!items || items.length !== 1) {
        err = errorcode.errorCodes.USER_PASS_MISMATCH;
      }
    }

    callback(err, items);
  });
};

/* record insertion, update & deletion methods */
exports.addNewAccount = function (newData, callback) {
  var user = newData.user;
  var description = newData.description;
  var email = newData.email;
  var nickname = newData.nickname;
  var details = '';
  var password;

  saltAndHash(newData.password, function (hash) {
    password = hash;
    // append date stamp when record was created //
    newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');

    var sp = "public_account_add_new_account";
    var params = {
      'nvc_account_name' : user,
      'nvc_account_description' : description,
      'vc_account_password' : password,
      'vc_account_email' : email,
      'nvc_account_nickname' : nickname
    };

    databaseManager.exec(sp, params, function (err, items) {
      //What err is thrown when username taken?
      err = errorcode.getErrorCode(err);
      if (!err) {
        if (!items || items.length !== 1) {
          err = errorcode.errorCodes.FAILED_CREATE_USER;
        }
      }

      callback(err, items);
    });
  });
};


//callback(err, account)
exports.getUserInfo = function (userId, callback) {

  var sp = "public_account_get_account";
  var params = {
    'i_account_id' : userId
  };

  databaseManager.exec(sp, params, function (err, items) {
    //What err is thrown when username taken?
    err = errorcode.getErrorCode(err);
    if (!err) {
      if (!items || items.length !== 1) {
        err = errorcode.errorCodes.USER_PASS_MISMATCH;
      }
    }

    callback(err, items);
  });
};


/* private encryption & validation methods */

var generateSalt = function () {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var salt = '';
  var p, i;

  for (i = 0; i < 10; i++) {
    p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
};

var md5 = function (str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function (pass, callback) {
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
};

var validatePassword = function (plainPass, hashedPass, callback) {
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  console.log(validHash);
  callback(null, hashedPass === validHash);
};
