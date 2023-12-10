import { produce } from 'immer';
import { SET_LATEST_DATE_SCHEDULE, SET_STATIONS } from './constants';

export const initialState = {
  stations: [],
  latestDateSchedule: null,
};

export const storedKey = [];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STATIONS:
        draft.stations = action.stations;
        break;
      case SET_LATEST_DATE_SCHEDULE:
        draft.latestDateSchedule = action.latestDateSchedule;
        break;
    }
  });

export default homeReducer;
