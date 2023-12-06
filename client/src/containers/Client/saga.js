import { login } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { LOGIN_USER } from './constants';
import { setLogin, setToken, setUser } from './actions';

function* doLoginUser({ inputs, handleSuccess, handleError }) {
  try {
    const response = yield call(login, inputs);
    yield put(setLogin(true));
    yield put(setToken(response.token));
    yield put(setUser(response.user));
    yield call(handleSuccess);
  } catch (error) {
    // error
    yield call(handleError, error.response.data.message);
  }
}

export default function* clientSaga() {
  yield takeLatest(LOGIN_USER, doLoginUser);
}
