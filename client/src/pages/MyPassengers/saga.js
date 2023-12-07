import { takeLatest, call, put } from 'redux-saga/effects';
import { getMyPassengers } from '@domain/api';
import { GET_MY_PASSENGERS } from './constants';
import { setMyPassengers } from './actions';

function* doGetMyPassengers() {
  try {
    const response = yield call(getMyPassengers);
    yield put(setMyPassengers(response.data));
  } catch (error) {
    // error
  }
}

export default function* myPassengersSaga() {
  yield takeLatest(GET_MY_PASSENGERS, doGetMyPassengers);
}
