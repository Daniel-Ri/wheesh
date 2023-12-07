import { takeLatest, call } from 'redux-saga/effects';
import { changePassword } from '@domain/api';
import { CHANGE_PASSWORD } from './constants';

function* doChangePassword({ inputs, handleSuccess, handleError }) {
  try {
    yield call(changePassword, inputs);
    yield call(handleSuccess);
  } catch (error) {
    // error
    yield call(handleError, error.response.data.message);
  }
}

export default function* changePasswordSaga() {
  yield takeLatest(CHANGE_PASSWORD, doChangePassword);
}
