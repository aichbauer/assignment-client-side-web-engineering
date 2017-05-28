import { take, call, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import request from '../../utils/request';
import { LOAD_CONSTRUCTORS, LOAD_DRIVERS } from './constants';
import {
  constructorsLoaded,
  constructorsError,
  driversLoaded,
  driversError,
} from './actions';

export function* getAllConstructors() {
  const requestURL = 'http://ergast.com/api/f1/constructors.json?offset=0&limit=1000';

  try {
    // Call our request helper (see 'utils/request')
    let constructors = yield call(request, requestURL);

    constructors = constructors.MRData.ConstructorTable.Constructors.map(
      ({ constructorId, name, nationality }) => ({
        id: constructorId,
        name,
        nationality,
      }),
    );

    yield put(constructorsLoaded(constructors));
  } catch (err) {
    yield put(constructorsError(err));
  }
}

export function* getDriversFromConstructor({ constructor }) {
  console.log('in');
  const requestURL = `http://ergast.com/api/f1/constructors/${constructor}/drivers.json`;

  try {
    // Call our request helper (see 'utils/request')
    let drivers = yield call(request, requestURL);
    console.log(drivers);
    drivers = drivers.MRData.DriverTable.Drivers.map(
      ({ driverId, givenName, familyName, dateOfBirth, nationality }) => ({
        id: driverId,
        givenName,
        familyName,
        dateOfBirth,
        nationality,
      }),
    );

    yield put(driversLoaded(drivers));
  } catch (err) {
    yield put(driversError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* searchFieldData() {
  const watcherConstructors = yield takeLatest(LOAD_CONSTRUCTORS, getAllConstructors);
  const watcherDrivers = yield takeLatest(LOAD_DRIVERS, getDriversFromConstructor);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcherConstructors);
  yield cancel(watcherDrivers);
}

// Bootstrap sagas
export default [
  searchFieldData,
];
