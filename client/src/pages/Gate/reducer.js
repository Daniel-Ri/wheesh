import { produce } from 'immer';
import { SET_STATIONS, SET_VALIDATE_RESULT } from './constants';

export const initialState = {
  stations: [],
  validateResult: null,
};

export const storedKey = [];

const gateReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STATIONS:
        draft.stations = action.stations;
        break;
      case SET_VALIDATE_RESULT:
        draft.validateResult = action.validateResult;
        break;
    }
  });

export default gateReducer;
