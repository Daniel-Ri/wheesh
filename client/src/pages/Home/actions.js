import { GET_ALL_STATIONS, SET_STATIONS } from './constants';

export const getAllStations = () => ({
  type: GET_ALL_STATIONS,
});

export const setStations = (stations) => ({
  type: SET_STATIONS,
  stations,
});
