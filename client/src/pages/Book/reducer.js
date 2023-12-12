import { produce } from 'immer';
import { SET_MY_PASSENGERS, SET_PASSENGER_IDS, SET_SCHEDULE, SET_STEP } from './constants';

export const initialState = {
  schedule: null,
  step: 0,
  myPassengers: [],
  passengerIds: [],
};

export const storedKey = [];

const bookReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SCHEDULE:
        draft.schedule = action.schedule;
        break;
      case SET_MY_PASSENGERS:
        draft.myPassengers = action.myPassengers;
        break;
      case SET_PASSENGER_IDS:
        draft.passengerIds = action.passengerIds;
        break;
      case SET_STEP:
        draft.step = action.step;
        break;
    }
  });

export default bookReducer;
