import {
  GET_ALL_STATIONS,
  GET_BANNERS,
  GET_LATEST_DATE_SCHEDULE,
  SET_BANNERS,
  SET_LATEST_DATE_SCHEDULE,
  SET_STATIONS,
} from './constants';

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

export const getBanners = () => ({
  type: GET_BANNERS,
});

export const setBanners = (banners) => ({
  type: SET_BANNERS,
  banners,
});
