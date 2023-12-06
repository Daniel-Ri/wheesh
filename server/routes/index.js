const express = require('express');
const userRoute = require('./userRoute');
const passengerRoute = require('./passengerRoute');
const router = express.Router();

router.use('/user', userRoute);
router.use('/passenger', passengerRoute);

module.exports = router;