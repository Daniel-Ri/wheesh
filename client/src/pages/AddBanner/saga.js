import { createBanner } from '@domain/api';
import { takeLatest, call } from 'redux-saga/effects';
import { CREATE_BANNER } from './constants';

function* doCreateBanner({ inputs, handleSuccess, handleError }) {
  try {
    yield call(createBanner, inputs);
    yield call(handleSuccess);
  } catch (error) {
    handleError(error.response.data.message);
  }
}

export default function* addBannerSaga() {
  yield takeLatest(CREATE_BANNER, doCreateBanner);
}
