var errors = {
  'ACCOUNT_EXISTS' : 'THE ACCOUNT ALREADY EXISTS'
};

exports.getErrorCode = function (msg) {
  console.log(msg);
  if (msg) {
    /*SQL Exception format :
      { [Error: [Microsoft][SQL Server Native Client 11.0][SQL Server]THE ACCOUNT ALREADY EXISTS writer3.] sqlstate: '42000', code: 50000 }
    */
    // If is not SQL exception, then string itself is the error message
    var err = msg.toString();
    if (err.search(errors.ACCOUNT_EXISTS) !== -1) {
      return 'username-taken';
    }

    return 'unknown-error';
  } else {
    return null;
  }
};