import { getAllStations, getLatestDateSchedule, getSchedules } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading } from '@containers/App/actions';
import { setLatestDateSchedule, setSchedules, setStations } from './actions';
import { GET_ALL_STATIONS, GET_LATEST_DATE_SCHEDULE, GET_SCHEDULES } from './constants';

function* doGetAllStations() {
  try {
    const response = yield call(getAllStations);
    yield put(setStations(response.data));
  } catch {
    // error
  }
}

function* doGetLatestDateSchedule() {
  try {
    const response = yield call(getLatestDateSchedule);
    yield put(setLatestDateSchedule(response.data));
  } catch {
    // error
  }
}

function* doGetSchedules({ departureStationId, arrivalStationId, date }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getSchedules, departureStationId, arrivalStationId, date);
    yield put(setSchedules(response.data));
  } catch {
    // error
  }
  yield put(setLoading(false));
}

export default function* scheduleSaga() {
  yield takeLatest(GET_ALL_STATIONS, doGetAllStations);
  yield takeLatest(GET_LATEST_DATE_SCHEDULE, doGetLatestDateSchedule);
  yield takeLatest(GET_SCHEDULES, doGetSchedules);
}
