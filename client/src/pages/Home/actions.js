import { GET_ALL_STATIONS, GET_LATEST_DATE_SCHEDULE, SET_LATEST_DATE_SCHEDULE, SET_STATIONS } from './constants';

export const getAllStations = () => ({
  type: GET_ALL_STATIONS,
});

export const setStations = (stations) => ({
  type: SET_STATIONS,
  stations,
});

export const getLatestDateSchedule = () => ({
  type: GET_LATEST_DATE_SCHEDULE,
});

export const setLatestDateSchedule = (latestDateSchedule) => ({
  type: SET_LATEST_DATE_SCHEDULE,
  latestDateSchedule,
});
