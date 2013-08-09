var errors = {
  'ACCOUNT_EXISTS' : 'THE ACCOUNT ALREADY EXISTS',
  'USER_PASS_MISMATCH' : 'THE USERNAME AND PASSWORD DOES NOT MATCH',
  'FAILED_CREATE_USER' : 'FAIL TO CREATE USER'
};

var errorCodes = {
  'ACCOUNT_EXISTS' : 'username-taken',
  'USER_PASS_MISMATCH' : 'user-pass-mismatch',
  'UNKNOWN' : 'unknown-error',
  'FAILED_CREATE_USER': 'failed_creation'
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
      return errorCodes.ACCOUNT_EXISTS;
    }

    return errorCodes.UNKNOWN;
  } else {
    return null;
  }
};

exports.errorCodes = errorCodes;