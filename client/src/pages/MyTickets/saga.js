import { getHistoryOrders, getPaidOrders, getUnpaidOrders } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setOrders } from './actions';
import { GET_ORDERS } from './constants';

function* doGetOrders({ navChosen }) {
  try {
    let response;
    if (navChosen === 'unpaid') {
      response = yield call(getUnpaidOrders);
    } else if (navChosen === 'paid') {
      response = yield call(getPaidOrders);
    } else if (navChosen === 'history') {
      response = yield call(getHistoryOrders);
    }
    yield put(setOrders(response.data));
  } catch (error) {
    // error
  }
}

export default function* myTicketsSaga() {
  yield takeLatest(GET_ORDERS, doGetOrders);
}
