import { produce } from 'immer';
import { SET_NAV_CHOSEN, SET_ORDERS } from './constants';

export const initialState = {
  navChosen: 'paid',
  orders: [],
};

export const storedKey = ['navChosen'];

const myTicketsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_NAV_CHOSEN:
        draft.navChosen = action.navChosen;
        break;
      case SET_ORDERS:
        draft.orders = action.orders;
        break;
    }
  });

export default myTicketsReducer;
