import { CREATE_PASSENGER } from './constants';

export const createPassenger = (inputs, handleSuccess, handleError) => ({
  type: CREATE_PASSENGER,
  inputs,
  handleSuccess,
  handleError,
});
