import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBookState = (state) => state.book || initialState;

export const selectSchedule = createSelector(selectBookState, (state) => state.schedule);
export const selectMyPassengers = createSelector(selectBookState, (state) => state.myPassengers);
export const selectPassengerIds = createSelector(selectBookState, (state) => state.passengerIds);
export const selectStep = createSelector(selectBookState, (state) => state.step);
