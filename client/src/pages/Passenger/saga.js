import { deletePassenger, getPassenger, updatePassenger } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setPassenger } from './actions';
import { DELETE_PASSENGER, GET_PASSENGER, UPDATE_PASSENGER } from './constants';

function* doGetPassenger({ passengerId, handleError }) {
  try {
    const response = yield call(getPassenger, passengerId);
    yield put(setPassenger(response.data));
  } catch (error) {
    // error
    yield call(handleError, error.response.data.message);
  }
}

function* doUpdatePassenger({ passengerId, inputs, handleSuccess, handleError }) {
  try {
    yield call(updatePassenger, passengerId, inputs);
    yield call(handleSuccess);
  } catch (error) {
    yield call(handleError, error.response.data.message);
  }
}

function* doDeletePassenger({ passengerId, handleSuccess, handleError }) {
  try {
    yield call(deletePassenger, passengerId);
    yield call(handleSuccess);
  } catch (error) {
    yield call(handleError, error.response.data.message);
  }
}

export default function* passengerSaga() {
  yield takeLatest(GET_PASSENGER, doGetPassenger);
  yield takeLatest(UPDATE_PASSENGER, doUpdatePassenger);
  yield takeLatest(DELETE_PASSENGER, doDeletePassenger);
}
