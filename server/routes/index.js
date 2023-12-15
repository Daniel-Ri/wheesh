const express = require('express');
const userRoute = require('./userRoute');
const passengerRoute = require('./passengerRoute');
const stationRoute = require('./stationRoute');
const scheduleRoute = require('./scheduleRoute');
const orderRoute = require('./orderRoute');
const bannerRoute = require('./bannerRoute');
const router = express.Router();

router.use('/user', userRoute);
router.use('/passenger', passengerRoute);
router.use('/station', stationRoute);
router.use('/schedule', scheduleRoute);
router.use('/order', orderRoute);
router.use('/banner', bannerRoute);

module.exports = router;