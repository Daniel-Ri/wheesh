import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPassengerState = (state) => state.passenger || initialState;

export const selectPassenger = createSelector(selectPassengerState, (state) => state.passenger);
