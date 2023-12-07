import { GET_PROFILE, SET_PROFILE, UPDATE_PROFILE } from './constants';

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  profile,
});

export const getProfile = () => ({
  type: GET_PROFILE,
});

export const updateProfile = (inputs, handleSuccess, handleError) => ({
  type: UPDATE_PROFILE,
  inputs,
  handleSuccess,
  handleError,
});
