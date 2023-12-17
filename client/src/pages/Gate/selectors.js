import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGateState = (state) => state.gate || initialState;

export const selectStations = createSelector(selectGateState, (state) => state.stations);
export const selectValidateResult = createSelector(selectGateState, (state) => state.validateResult);
