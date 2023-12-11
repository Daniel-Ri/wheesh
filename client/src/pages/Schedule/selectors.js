import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectScheduleState = (state) => state.schedule || initialState;

export const selectStations = createSelector(selectScheduleState, (state) => state.stations);
export const selectLatestDateSchedule = createSelector(selectScheduleState, (state) => state.latestDateSchedule);
export const selectSchedules = createSelector(selectScheduleState, (state) => state.schedules);
