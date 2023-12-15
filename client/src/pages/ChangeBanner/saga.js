import { getBanner, updateBanner } from '@domain/api';
import { takeLatest, call } from 'redux-saga/effects';
import { GET_BANNER, UPDATE_BANNER } from './constants';

function* doGetBanner({ bannerId, handleError }) {
  try {
    yield call(getBanner, bannerId);
  } catch (error) {
    handleError(error.response.data.message);
  }
}

function* doUpdateBanner({ bannerId, inputs, handleSuccess, handleError }) {
  try {
    yield call(updateBanner, bannerId, inputs);
    yield call(handleSuccess);
  } catch (error) {
    handleError(error.response.data.message);
  }
}

export default function* changeBannerSaga() {
  yield takeLatest(GET_BANNER, doGetBanner);
  yield takeLatest(UPDATE_BANNER, doUpdateBanner);
}
