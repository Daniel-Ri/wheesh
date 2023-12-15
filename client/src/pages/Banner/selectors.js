import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBannerState = (state) => state.banner || initialState;

export const selectBanners = createSelector(selectBannerState, (state) => state.banners);
