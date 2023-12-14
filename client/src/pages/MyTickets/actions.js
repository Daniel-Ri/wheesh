import { GET_ORDERS, SET_NAV_CHOSEN, SET_ORDERS } from './constants';

export const setNavChosen = (navChosen) => ({
  type: SET_NAV_CHOSEN,
  navChosen,
});

export const getOrders = (navChosen) => ({
  type: GET_ORDERS,
  navChosen,
});

export const setOrders = (orders) => ({
  type: SET_ORDERS,
  orders,
});
