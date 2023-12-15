import { takeLatest, call, put } from 'redux-saga/effects';
import { deleteBanner, getAllBanners } from '@domain/api';
import { DELETE_BANNER, GET_BANNERS } from './constants';
import { removeBanner, setBanners } from './actions';

function* doGetBanners() {
  try {
    const response = yield call(getAllBanners);
    yield put(setBanners(response.data));
  } catch (error) {
    // error
  }
}

function* doDeleteBanner({ bannerId, handleSuccess, handleError }) {
  try {
    yield call(deleteBanner, bannerId);
    yield put(removeBanner(bannerId));
    yield call(handleSuccess);
  } catch (error) {
    // error
    yield call(handleError, error.response.data.message);
  }
}

export default function* bannerSaga() {
  yield takeLatest(GET_BANNERS, doGetBanners);
  yield takeLatest(DELETE_BANNER, doDeleteBanner);
}
