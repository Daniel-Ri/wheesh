import { takeLatest, call, put } from 'redux-saga/effects';
import { changeEmail } from '@domain/api';
import { setUser } from '@containers/Client/actions';
import { CHANGE_EMAIL } from './constants';

function* doChangeEmail({ inputs, handleSuccess, handleError }) {
  try {
    const response = yield call(changeEmail, inputs);
    yield put(setUser(response.data));
    yield call(handleSuccess);
  } catch (error) {
    yield call(handleError, error.response.data.message);
  }
}

export default function* changeEmailSaga() {
  yield takeLatest(CHANGE_EMAIL, doChangeEmail);
}
