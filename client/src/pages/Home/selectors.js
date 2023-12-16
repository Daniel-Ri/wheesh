import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHomeState = (state) => state.home || initialState;

export const selectStations = createSelector(selectHomeState, (state) => state.stations);
export const selectLatestDateSchedule = createSelector(selectHomeState, (state) => state.latestDateSchedule);
export const selectBanners = createSelector(selectHomeState, (state) => state.banners);
