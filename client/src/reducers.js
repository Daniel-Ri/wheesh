import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import myPassengersReducer, { storedKey as storedMyPassengersState } from '@pages/MyPassengers/reducer';
import passengerReducer, { storedKey as storedPassengerState } from '@pages/Passenger/reducer';
import profileReducer, { storedKey as storedProfileState } from '@pages/Profile/reducer';
import homeReducer, { storedKey as storedHomeState } from '@pages/Home/reducer';
import scheduleReducer, { storedKey as storedScheduleState } from '@pages/Schedule/reducer';
import bookReducer, { storedKey as storedBookState } from '@pages/Book/reducer';
import myTicketsReducer, { storedKey as storedMyTicketsState } from '@pages/MyTickets/reducer';
import languageReducer from '@containers/Language/reducer';

import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  client: { reducer: clientReducer, whitelist: storedClientState },
  myPassengers: { reducer: myPassengersReducer, whitelist: storedMyPassengersState },
  passenger: { reducer: passengerReducer, whitelist: storedPassengerState },
  profile: { reducer: profileReducer, whitelist: storedProfileState },
  home: { reducer: homeReducer, whitelist: storedHomeState },
  schedule: { reducer: scheduleReducer, whitelist: storedScheduleState },
  book: { reducer: bookReducer, whitelist: storedBookState },
  myTickets: { reducer: myTicketsReducer, whitelist: storedMyTicketsState },
};

const temporaryReducers = {
  language: languageReducer,
};

const createReducer = () => {
  const coreReducer = combineReducers({
    ...mapWithPersistor(storedReducers),
    ...temporaryReducers,
  });
  const rootReducer = (state, action) => coreReducer(state, action);
  return rootReducer;
};

export default createReducer;
