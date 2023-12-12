const express = require('express');
const authentication = require('../middlewares/authentication');
const { createOrder } = require('../controllers/orderController');

const orderRoute = express.Router();

orderRoute.use(authentication);
orderRoute.post('/', createOrder);

module.exports = orderRoute;