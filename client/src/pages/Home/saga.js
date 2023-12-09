import { getAllStations } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setStations } from './actions';
import { GET_ALL_STATIONS } from './constants';

function* doGetAllStations() {
  try {
    const response = yield call(getAllStations);
    yield put(setStations(response.data));
  } catch {
    // error
  }
}

export default function* homeSaga() {
  yield takeLatest(GET_ALL_STATIONS, doGetAllStations);
}
