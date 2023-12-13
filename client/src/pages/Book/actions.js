import {
  CREATE_ORDER,
  GET_MY_PASSENGERS,
  GET_SCHEDULE,
  SET_CHOSEN_SEATS,
  SET_MY_PASSENGERS,
  SET_PASSENGER_IDS,
  SET_SCHEDULE,
  SET_STEP,
} from './constants';

export const getSchedule = (scheduleId) => ({
  type: GET_SCHEDULE,
  scheduleId,
});

export const setSchedule = (schedule) => ({
  type: SET_SCHEDULE,
  schedule,
});

export const setMyPassengers = (myPassengers) => ({
  type: SET_MY_PASSENGERS,
  myPassengers,
});

export const getMyPassengers = () => ({
  type: GET_MY_PASSENGERS,
});

export const setPassengerIds = (passengerIds) => ({
  type: SET_PASSENGER_IDS,
  passengerIds,
});

export const setStep = (step) => ({
  type: SET_STEP,
  step,
});

export const setChosenSeats = (chosenSeats) => ({
  type: SET_CHOSEN_SEATS,
  chosenSeats,
});

export const createOrder = (inputs, handleSuccess, handleError) => ({
  type: CREATE_ORDER,
  inputs,
  handleSuccess,
  handleError,
});
