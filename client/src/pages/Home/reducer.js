import { produce } from 'immer';
import { SET_STATIONS } from './constants';

export const initialState = {
  stations: [],
};

export const storedKey = [];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STATIONS:
        draft.stations = action.stations;
        break;
    }
  });

export default homeReducer;
