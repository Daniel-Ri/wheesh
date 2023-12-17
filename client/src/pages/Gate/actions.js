import {
  GET_ALL_STATIONS,
  SET_STATIONS,
  SET_VALIDATE_RESULT,
  VALIDATE_TICKET_ON_ARRIVAL,
  VALIDATE_TICKET_ON_DEPARTURE,
} from './constants';

export const getAllStations = () => ({
  type: GET_ALL_STATIONS,
});

export const setStations = (stations) => ({
  type: SET_STATIONS,
  stations,
});

export const validateTicketOnDeparture = (inputs, handleSuccess, handleError) => ({
  type: VALIDATE_TICKET_ON_DEPARTURE,
  inputs,
  handleSuccess,
  handleError,
});

export const validateTicketOnArrival = (inputs, handleSuccess, handleError) => ({
  type: VALIDATE_TICKET_ON_ARRIVAL,
  inputs,
  handleSuccess,
  handleError,
});

export const setValidateResult = (validateResult) => ({
  type: SET_VALIDATE_RESULT,
  validateResult,
});
