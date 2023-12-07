import { CHANGE_PASSWORD } from './constants';

export const changePassword = (inputs, handleSuccess, handleError) => ({
  type: CHANGE_PASSWORD,
  inputs,
  handleSuccess,
  handleError,
});
