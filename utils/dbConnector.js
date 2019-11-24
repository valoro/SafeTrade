require('dotenv').config();

module.exports = {
  uri: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds151544.mlab.com:51544/${process.env.DB_NAME}`,
  secret: `${process.env.DB_SECRET}`
};
