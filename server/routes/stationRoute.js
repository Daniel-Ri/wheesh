const express = require('express');
const authentication = require('../middlewares/authentication');
const { getAllStations } = require('../controllers/stationController');
const stationRoute = express.Router();

stationRoute.get('/', getAllStations);

module.exports = stationRoute;