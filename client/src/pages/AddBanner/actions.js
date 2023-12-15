import { CREATE_BANNER } from './constants';

export const createBanner = (inputs, handleSuccess, handleError) => ({
  type: CREATE_BANNER,
  inputs,
  handleSuccess,
  handleError,
});
