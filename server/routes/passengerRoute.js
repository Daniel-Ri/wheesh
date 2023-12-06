const express = require('express');
const authentication = require('../middlewares/authentication');
const { getMyPassengers, createPassenger, getPassenger, updatePassenger, deletePassenger } = require('../controllers/passengerController');
const passengerRoute = express.Router();

passengerRoute.use(authentication);
passengerRoute.get('/', getMyPassengers);
passengerRoute.get('/:passengerId', getPassenger);
passengerRoute.post('/', createPassenger);
passengerRoute.put('/:passengerId', updatePassenger);
passengerRoute.delete('/:passengerId', deletePassenger);

module.exports = passengerRoute;