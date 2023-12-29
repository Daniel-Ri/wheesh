import { login, register, sendEmailToken, verifyToken } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { decrypt, encrypt } from '@utils/handleCrypto';
import { LOGIN_USER, REGISTER_USER, SEND_EMAIL_TOKEN, VERIFY_TOKEN } from './constants';
import { setLogin, setToken, setUser } from './actions';

function* doLoginUser({ inputs, handleSuccess, handleError }) {
  try {
    const encryptedObj = yield call(encrypt, JSON.stringify(inputs));
    const response = yield call(login, { encryptedObj });
    yield put(setLogin(true));
    yield put(setToken(response.token));

    const decryptedUser = yield call(decrypt, response.user);
    const userObj = JSON.parse(decryptedUser);
    yield put(setUser(userObj));
    yield call(handleSuccess);
  } catch (error) {
    yield call(handleError, error.response.data.message);
  }
}

function* doSendEmailToken({ inputs, handleSuccess, handleError }) {
  try {
    yield call(sendEmailToken, inputs);
    yield call(handleSuccess);
  } catch (error) {
    yield call(handleError, error.response.data.message);
  }
}

function* doRegisterUser({ inputs, handleSuccess, handleError }) {
  try {
    yield call(register, inputs);
    yield call(handleSuccess);
  } catch (error) {
    yield call(handleError, error.response.data.message);
  }
}

function* doVerifyToken({ handleError }) {
  try {
    yield call(verifyToken);
  } catch (error) {
    yield call(handleError);
  }
}

export default function* clientSaga() {
  yield takeLatest(LOGIN_USER, doLoginUser);
  yield takeLatest(SEND_EMAIL_TOKEN, doSendEmailToken);
  yield takeLatest(REGISTER_USER, doRegisterUser);
  yield takeLatest(VERIFY_TOKEN, doVerifyToken);
}
