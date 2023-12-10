const express = require('express');
const { getLatestDateSchedule, getSchedules } = require('../controllers/scheduleController');
const scheduleRoute = express.Router();

scheduleRoute.get('/latestDate', getLatestDateSchedule);
scheduleRoute.get('/:departureStationId/:arrivalStationId/:date', getSchedules);

module.exports = scheduleRoute;