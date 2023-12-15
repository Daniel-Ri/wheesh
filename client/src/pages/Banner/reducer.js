import { produce } from 'immer';
import { REMOVE_BANNER, SET_BANNERS } from './constants';

export const initialState = {
  banners: [],
};

export const storedKey = [];

const bannerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_BANNERS:
        draft.banners = action.banners;
        break;
      case REMOVE_BANNER:
        draft.banners = draft.banners.filter((banner) => banner.id !== action.bannerId);
        break;
    }
  });

export default bannerReducer;
