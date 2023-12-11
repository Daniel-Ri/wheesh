import { produce } from 'immer';
import { SET_LATEST_DATE_SCHEDULE, SET_SCHEDULES, SET_STATIONS } from './constants';

export const initialState = {
  stations: [],
  latestDateSchedule: null,
  schedules: [],
};

export const storedKey = [];

const scheduleReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STATIONS:
        draft.stations = action.stations;
        break;
      case SET_LATEST_DATE_SCHEDULE:
        draft.latestDateSchedule = action.latestDateSchedule;
        break;
      case SET_SCHEDULES:
        draft.schedules = action.schedules;
        break;
    }
  });

export default scheduleReducer;
