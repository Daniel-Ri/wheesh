import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';
import myPassengersSaga from '@pages/MyPassengers/saga';
import createPassengerSaga from '@pages/CreatePassenger/saga';
import passengerSaga from '@pages/Passenger/saga';
import profileSaga from '@pages/Profile/saga';
import changePasswordSaga from '@pages/ChangePassword/saga';
import changeEmailSaga from '@pages/ChangeEmail/saga';
import homeSaga from '@pages/Home/saga';
import scheduleSaga from '@pages/Schedule/saga';
import bookSaga from '@pages/Book/saga';
import myTicketsSaga from '@pages/MyTickets/saga';
import unpaidSaga from '@pages/Unpaid/saga';
import orderSaga from '@pages/Order/saga';
import historySaga from '@pages/History/saga';
import bannerSaga from '@pages/Banner/saga';

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
    homeSaga(),
    scheduleSaga(),
    bookSaga(),
    myTicketsSaga(),
    unpaidSaga(),
    orderSaga(),
    historySaga(),
    bannerSaga(),
  ]);
}
