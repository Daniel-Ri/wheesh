import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectUnpaidState = (state) => state.unpaid || initialState;

export const selectOrder = createSelector(selectUnpaidState, (state) => state.order);
