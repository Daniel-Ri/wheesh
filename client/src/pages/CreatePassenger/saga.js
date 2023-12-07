import { takeLatest, call } from 'redux-saga/effects';
import { createPassenger } from '@domain/api';
import { CREATE_PASSENGER } from './constants';

function* doCreatePassenger({ inputs, handleSuccess, handleError }) {
  try {
    yield call(createPassenger, inputs);
    yield call(handleSuccess);
  } catch (error) {
    // error
    yield call(handleError, error.response.data.message);
  }
}

export default function* createPassengerSaga() {
  yield takeLatest(CREATE_PASSENGER, doCreatePassenger);
}
