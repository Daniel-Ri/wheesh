import { produce } from 'immer';
import { SET_ORDER } from './constants';

export const initialState = {
  order: null,
};

export const storedKey = [];

const unpaidReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDER:
        draft.order = action.order;
        break;
    }
  });

export default unpaidReducer;
