import {
  LOGIN_USER,
  LOGOUT,
  REGISTER_USER,
  SEND_EMAIL_TOKEN,
  SET_LOGIN,
  SET_TOKEN,
  SET_USER,
} from '@containers/Client/constants';

export const setLogin = (login) => ({
  type: SET_LOGIN,
  login,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  token,
});

export const setUser = (user) => ({
  type: SET_USER,
  user,
});

export const loginUser = (inputs, handleSuccess, handleError) => ({
  type: LOGIN_USER,
  inputs,
  handleSuccess,
  handleError,
});

export const registerUser = (inputs, handleSuccess, handleError) => ({
  type: REGISTER_USER,
  inputs,
  handleSuccess,
  handleError,
});

export const sendEmailToken = (inputs, handleSuccess, handleError) => ({
  type: SEND_EMAIL_TOKEN,
  inputs,
  handleSuccess,
  handleError,
});

export const logout = () => ({
  type: LOGOUT,
});
