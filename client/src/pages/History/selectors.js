import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHistoryState = (state) => state.history || initialState;

export const selectOrder = createSelector(selectHistoryState, (state) => state.order);
