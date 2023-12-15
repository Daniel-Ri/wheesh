import { DELETE_BANNER, GET_BANNERS, REMOVE_BANNER, SET_BANNERS } from './constants';

export const setBanners = (banners) => ({
  type: SET_BANNERS,
  banners,
});

export const getBanners = () => ({
  type: GET_BANNERS,
});

export const deleteBanner = (bannerId, handleSuccess, handleError) => ({
  type: DELETE_BANNER,
  bannerId,
  handleSuccess,
  handleError,
});

export const removeBanner = (bannerId) => ({
  type: REMOVE_BANNER,
  bannerId,
});
