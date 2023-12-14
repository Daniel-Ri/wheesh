import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMyTicketsState = (state) => state.myTickets || initialState;

export const selectNavChosen = createSelector(selectMyTicketsState, (state) => state.navChosen);
export const selectOrders = createSelector(selectMyTicketsState, (state) => state.orders);
