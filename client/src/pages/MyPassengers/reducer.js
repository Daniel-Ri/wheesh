import { produce } from 'immer';
import { SET_MY_PASSENGERS } from './constants';

export const initialState = {
  myPassengers: [],
};

export const storedKey = [];

const myPassengersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MY_PASSENGERS:
        draft.myPassengers = action.myPassengers;
        break;
    }
  });

export default myPassengersReducer;
