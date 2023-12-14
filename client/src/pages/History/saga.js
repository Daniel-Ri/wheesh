import { getOrder } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setOrder } from './actions';
import { GET_ORDER } from './constants';

function* doGetOrder({ orderId, handleError }) {
  try {
    const response = yield call(getOrder, orderId);
    yield put(setOrder(response.data));
  } catch (error) {
    handleError(error.response.data.message);
  }
}

export default function* historySaga() {
  yield takeLatest(GET_ORDER, doGetOrder);
}
