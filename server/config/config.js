const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_DEV_URL,
    dialect: 'mysql',
    timeZone: "+07:00"
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: 'mysql',
    timeZone: "+07:00",
    logging: false
  },
  production: {
    url: process.env.DATABASE_PROD_URL,
    dialect: process.env.DATABASE_PROD_DIALECT,
    timeZone: "+07:00",
    dialectOptions: { ssl: { require: process.env.SSL_REQUIRED === "true" } }
  }
};