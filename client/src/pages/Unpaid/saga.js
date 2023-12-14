import { takeLatest, call, put } from 'redux-saga/effects';
import { cancelOrder, getOrder, payOrder } from '@domain/api';
import { CANCEL_ORDER, GET_ORDER, PAY_ORDER } from './constants';
import { setOrder } from './actions';

function* doGetOrder({ orderId, handleError }) {
  try {
    const response = yield call(getOrder, orderId);
    yield put(setOrder(response.data));
  } catch (error) {
    handleError(error.response.data.message);
  }
}

function* doCancelOrder({ orderId, handleSuccess, handleError }) {
  try {
    yield call(cancelOrder, orderId);
    yield call(handleSuccess);
  } catch (error) {
    handleError(error.response.data.message);
  }
}

function* doPayOrder({ orderId, handleSuccess, handleError }) {
  try {
    yield call(payOrder, orderId);
    yield call(handleSuccess);
  } catch (error) {
    handleError(error.response.data.message);
  }
}

export default function* unpaidSaga() {
  yield takeLatest(GET_ORDER, doGetOrder);
  yield takeLatest(CANCEL_ORDER, doCancelOrder);
  yield takeLatest(PAY_ORDER, doPayOrder);
}
