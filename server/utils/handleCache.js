const dotenv = require('dotenv');
dotenv.config();
const Redis = require('ioredis');

let redisClient;

if (process.env.NODE_ENV === "production") {
  redisClient = new Redis({
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  });
} else {
  redisClient = new Redis({
    host: 'localhost',
    port: 6379,
  })
}

redisClient.on('connect', () => {
    console.log('Successfully connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});


module.exports = redisClient;