import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';
import myPassengersSaga from '@pages/MyPassengers/saga';
import createPassengerSaga from '@pages/CreatePassenger/saga';
import passengerSaga from '@pages/Passenger/saga';
import profileSaga from '@pages/Profile/saga';
import changePasswordSaga from '@pages/ChangePassword/saga';
import changeEmailSaga from '@pages/ChangeEmail/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    clientSaga(),
    myPassengersSaga(),
    createPassengerSaga(),
    passengerSaga(),
    profileSaga(),
    changePasswordSaga(),
    changeEmailSaga(),
  ]);
}
