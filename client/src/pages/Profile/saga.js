import { getProfile, updateProfile } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { setUser } from '@containers/Client/actions';
import { setProfile } from './actions';
import { GET_PROFILE, UPDATE_PROFILE } from './constants';

function* doGetProfile() {
  try {
    const response = yield call(getProfile);
    yield put(setProfile(response.data));
  } catch (error) {
    // error
  }
}

function* doUpdateProfile({ inputs, handleSuccess, handleError }) {
  try {
    const response = yield call(updateProfile, inputs);
    yield put(setUser(response.data));
    yield call(handleSuccess);
  } catch (error) {
    yield call(handleError, error.response.data.message);
  }
}

export default function* profileSaga() {
  yield takeLatest(GET_PROFILE, doGetProfile);
  yield takeLatest(UPDATE_PROFILE, doUpdateProfile);
}
