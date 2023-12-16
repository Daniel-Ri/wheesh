import { getAllBanners, getAllStations, getLatestDateSchedule } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setBanners, setLatestDateSchedule, setStations } from './actions';
import { GET_ALL_STATIONS, GET_BANNERS, GET_LATEST_DATE_SCHEDULE } from './constants';

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

function* doGetBanners() {
  try {
    const response = yield call(getAllBanners);
    yield put(setBanners(response.data));
  } catch {
    // error
  }
}

export default function* homeSaga() {
  yield takeLatest(GET_ALL_STATIONS, doGetAllStations);
  yield takeLatest(GET_LATEST_DATE_SCHEDULE, doGetLatestDateSchedule);
  yield takeLatest(GET_BANNERS, doGetBanners);
}
