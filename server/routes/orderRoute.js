const express = require('express');
const authentication = require('../middlewares/authentication');
const { createOrder, getUnpaidOrders, getPaidOrders, getHistoryOrders, getOrder, payOrder, cancelOrder, 
        validateTicketOnDeparture, 
        validateTicketOnArrival} = require('../controllers/orderController');

const orderRoute = express.Router();

orderRoute.post('/validateDepart', validateTicketOnDeparture);
orderRoute.post('/validateArrive', validateTicketOnArrival);

orderRoute.use(authentication);
orderRoute.get('/unpaid', getUnpaidOrders);
orderRoute.get('/paid', getPaidOrders);
orderRoute.get('/history', getHistoryOrders);
orderRoute.get('/:orderId', getOrder);
orderRoute.post('/', createOrder);
orderRoute.put('/:orderId', payOrder);
orderRoute.delete('/:orderId', cancelOrder);

module.exports = orderRoute;