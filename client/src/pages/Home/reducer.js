import { produce } from 'immer';
import { SET_BANNERS, SET_LATEST_DATE_SCHEDULE, SET_STATIONS } from './constants';

export const initialState = {
  stations: [],
  latestDateSchedule: null,
  banners: [],
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
      case SET_BANNERS:
        draft.banners = action.banners;
        break;
    }
  });

export default homeReducer;
