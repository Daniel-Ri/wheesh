import { CANCEL_ORDER, GET_ORDER, PAY_ORDER, SET_ORDER } from './constants';

export const getOrder = (orderId, handleError) => ({
  type: GET_ORDER,
  orderId,
  handleError,
});

export const setOrder = (order) => ({
  type: SET_ORDER,
  order,
});

export const cancelOrder = (orderId, handleSuccess, handleError) => ({
  type: CANCEL_ORDER,
  orderId,
  handleSuccess,
  handleError,
});

export const payOrder = (orderId, handleSuccess, handleError) => ({
  type: PAY_ORDER,
  orderId,
  handleSuccess,
  handleError,
});
