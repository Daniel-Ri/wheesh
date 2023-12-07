import { produce } from 'immer';
import { SET_PASSENGER } from './constants';

export const initialState = {
  passenger: null,
};

export const storedKey = [];

const passengerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PASSENGER:
        draft.passenger = action.passenger;
        break;
    }
  });

export default passengerReducer;
