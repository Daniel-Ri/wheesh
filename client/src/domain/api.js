import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  ping: 'ping.json',
  user: 'user',
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
export const getProfile = () => callAPI(urls.user, 'GET');
export const updateProfile = (inputs) => callAPI(urls.user, 'PUT', {}, {}, inputs);
