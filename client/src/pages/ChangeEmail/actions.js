import { CHANGE_EMAIL } from './constants';

export const changeEmail = (inputs, handleSuccess, handleError) => ({
  type: CHANGE_EMAIL,
  inputs,
  handleSuccess,
  handleError,
});
