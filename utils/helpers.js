const jwt = require('jsonwebtoken');
const dbConnector = require('../utils/dbConnector');

const blockchainStrings = require('../utils/blockchainStrings');

const helper = {
  verifyToken: (encodedToken, callback) => {
    const token = encodedToken.split(' ')[1];
    return jwt.verify(token, dbConnector.secret, callback);
  },
  isAdmin: encodedToken => {
    return new Promise((resolve, reject) => {
      if (helper.verifyToken(encodedToken).role === blockchainStrings.roles.admin) {
        return resolve();
      } else {
        return reject();
      }
    });
  }
}

module.exports = helper;