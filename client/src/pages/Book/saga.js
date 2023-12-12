import { getMyPassengers, getSchedule } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setMyPassengers, setSchedule } from './actions';
import { GET_MY_PASSENGERS, GET_SCHEDULE } from './constants';

function* doGetSchedule({ scheduleId }) {
  try {
    const response = yield call(getSchedule, scheduleId);
    yield put(setSchedule(response.data));
  } catch {
    // error
  }
}

function* doGetMyPassengers() {
  try {
    const response = yield call(getMyPassengers);
    yield put(setMyPassengers(response.data));
  } catch (error) {
    // error
  }
}

export default function* bookSaga() {
  yield takeLatest(GET_SCHEDULE, doGetSchedule);
  yield takeLatest(GET_MY_PASSENGERS, doGetMyPassengers);
}
