import { DELETE_PASSENGER, GET_PASSENGER, SET_PASSENGER, UPDATE_PASSENGER } from './constants';

export const setPassenger = (passenger) => ({
  type: SET_PASSENGER,
  passenger,
});

export const getPassenger = (passengerId, handleError) => ({
  type: GET_PASSENGER,
  passengerId,
  handleError,
});

export const updatePassenger = (passengerId, inputs, handleSuccess, handleError) => ({
  type: UPDATE_PASSENGER,
  passengerId,
  inputs,
  handleSuccess,
  handleError,
});

export const deletePassenger = (passengerId, handleSuccess, handleError) => ({
  type: DELETE_PASSENGER,
  passengerId,
  handleSuccess,
  handleError,
});
