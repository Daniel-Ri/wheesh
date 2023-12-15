import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  ping: 'ping.json',
  user: 'user',
  passenger: 'passenger',
  station: 'station',
  schedule: 'schedule',
  order: 'order',
  banner: 'banner',
};

export const callAPI = async (endpoint, method, header = {}, params = {}, data = {}) => {
  const defaultHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };

  const headers = merge(defaultHeader, header);
  const options = {
    url: config.api.host + endpoint,
    method,
    headers,
    data,
    params,
  };

  return request(options).then((response) => {
    const responseAPI = response.data;
    return responseAPI;
  });
};

export const ping = () => callAPI(urls.ping, 'get');
export const login = (inputs) => callAPI(`${urls.user}/login`, 'POST', {}, {}, inputs);
export const sendEmailToken = (inputs) => callAPI(`${urls.user}/sendEmailToken`, 'POST', {}, {}, inputs);
export const register = (inputs) => callAPI(`${urls.user}/register`, 'POST', {}, {}, inputs);
export const verifyToken = () => callAPI(`${urls.user}/verifyToken`, 'POST');
export const getProfile = () => callAPI(urls.user, 'GET');
export const updateProfile = (inputs) => callAPI(urls.user, 'PUT', {}, {}, inputs);
export const changePassword = (inputs) => callAPI(`${urls.user}/changePassword`, 'PUT', {}, {}, inputs);
export const changeEmail = (inputs) => callAPI(`${urls.user}/changeEmail`, 'PUT', {}, {}, inputs);
export const getMyPassengers = () => callAPI(urls.passenger, 'GET');
export const getPassenger = (passengerId) => callAPI(`${urls.passenger}/${passengerId}`, 'GET');
export const createPassenger = (inputs) => callAPI(urls.passenger, 'POST', {}, {}, inputs);
export const updatePassenger = (passengerId, inputs) =>
  callAPI(`${urls.passenger}/${passengerId}`, 'PUT', {}, {}, inputs);
export const deletePassenger = (passengerId) => callAPI(`${urls.passenger}/${passengerId}`, 'DELETE');
export const getAllStations = () => callAPI(urls.station, 'GET');
export const getLatestDateSchedule = () => callAPI(`${urls.schedule}/latestDate`, 'GET');
export const getSchedules = (departureStationId, arrivalStationId, date) =>
  callAPI(`${urls.schedule}/${departureStationId}/${arrivalStationId}/${date}`, 'GET');
export const getSchedule = (scheduleId) => callAPI(`${urls.schedule}/${scheduleId}`, 'GET');
export const getUnpaidOrders = () => callAPI(`${urls.order}/unpaid`, 'GET');
export const getPaidOrders = () => callAPI(`${urls.order}/paid`, 'GET');
export const getHistoryOrders = () => callAPI(`${urls.order}/history`, 'GET');
export const getOrder = (orderId) => callAPI(`${urls.order}/${orderId}`, 'GET');
export const payOrder = (orderId) => callAPI(`${urls.order}/${orderId}`, 'PUT');
export const cancelOrder = (orderId) => callAPI(`${urls.order}/${orderId}`, 'DELETE');
export const createOrder = (inputs) => {
  const header = {
    'Content-Type': 'application/json; charset=UTF-8',
  };
  return callAPI(urls.order, 'POST', header, {}, inputs);
};
export const getAllBanners = () => callAPI(urls.banner, 'GET');
export const createBanner = (inputs) => callAPI(urls.banner, 'POST', {}, {}, inputs);
export const updateBanner = (bannerId, inputs) => callAPI(`${urls.banner}/${bannerId}`, 'PUT', {}, {}, inputs);
export const deleteBanner = (bannerId) => callAPI(`${urls.banner}/${bannerId}`, 'DELETE');
