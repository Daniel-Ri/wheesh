const express = require('express');
const userRoute = require('./userRoute');
const passengerRoute = require('./passengerRoute');
const stationRoute = require('./stationRoute');
const scheduleRoute = require('./scheduleRoute');
const orderRoute = require('./orderRoute');
const router = express.Router();

router.use('/user', userRoute);
router.use('/passenger', passengerRoute);
router.use('/station', stationRoute);
router.use('/schedule', scheduleRoute);
router.use('/order', orderRoute);

module.exports = router;