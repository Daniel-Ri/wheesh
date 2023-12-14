import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectOrderState = (state) => state.order || initialState;

export const selectOrder = createSelector(selectOrderState, (state) => state.order);
