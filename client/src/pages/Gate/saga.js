import { getAllStations, validateTicketOnArrival, validateTicketOnDeparture } from '@domain/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_ALL_STATIONS, VALIDATE_TICKET_ON_ARRIVAL, VALIDATE_TICKET_ON_DEPARTURE } from './constants';
import { setStations, setValidateResult } from './actions';

function* doGetAllStations() {
  try {
    const response = yield call(getAllStations);
    yield put(setStations(response.data));
  } catch {
    // error
  }
}

function* doValidateTicketOnDeparture({ inputs, handleSuccess, handleError }) {
  try {
    const response = yield call(validateTicketOnDeparture, inputs);
    yield put(setValidateResult(response.data));
    yield call(handleSuccess);
  } catch (error) {
    handleError(error.response.data.message);
  }
}

function* doValidateTicketOnArrival({ inputs, handleSuccess, handleError }) {
  try {
    const response = yield call(validateTicketOnArrival, inputs);
    yield put(setValidateResult(response.data));
    yield call(handleSuccess);
  } catch (error) {
    handleError(error.response.data.message);
  }
}

export default function* gateSaga() {
  yield takeLatest(GET_ALL_STATIONS, doGetAllStations);
  yield takeLatest(VALIDATE_TICKET_ON_DEPARTURE, doValidateTicketOnDeparture);
  yield takeLatest(VALIDATE_TICKET_ON_ARRIVAL, doValidateTicketOnArrival);
}
