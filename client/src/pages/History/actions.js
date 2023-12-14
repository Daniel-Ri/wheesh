import { GET_ORDER, SET_ORDER } from './constants';

export const getOrder = (orderId, handleError) => ({
  type: GET_ORDER,
  orderId,
  handleError,
});

export const setOrder = (order) => ({
  type: SET_ORDER,
  order,
});
