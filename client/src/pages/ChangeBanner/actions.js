import { GET_BANNER, UPDATE_BANNER } from './constants';

export const getBanner = (bannerId, handleError) => ({
  type: GET_BANNER,
  bannerId,
  handleError,
});

export const updateBanner = (bannerId, inputs, handleSuccess, handleError) => ({
  type: UPDATE_BANNER,
  bannerId,
  inputs,
  handleSuccess,
  handleError,
});
