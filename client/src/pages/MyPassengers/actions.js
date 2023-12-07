import { GET_MY_PASSENGERS, SET_MY_PASSENGERS } from './constants';

export const setMyPassengers = (myPassengers) => ({
  type: SET_MY_PASSENGERS,
  myPassengers,
});

export const getMyPassengers = () => ({
  type: GET_MY_PASSENGERS,
});
