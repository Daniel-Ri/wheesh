const express = require('express');
const { getLatestDateSchedule, getSchedules, getSchedule } = require('../controllers/scheduleController');
const scheduleRoute = express.Router();

scheduleRoute.get('/latestDate', getLatestDateSchedule);
scheduleRoute.get('/:scheduleId', getSchedule);
scheduleRoute.get('/:departureStationId/:arrivalStationId/:date', getSchedules);

module.exports = scheduleRoute;