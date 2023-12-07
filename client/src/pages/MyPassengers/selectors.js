import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMyPassengersState = (state) => state.myPassengers || initialState;

export const selectMyPassengers = createSelector(selectMyPassengersState, (state) => state.myPassengers);
