import { fromJS } from 'immutable';

import {
  LOAD_CONSTRUCTORS_SUCCESS,
  LOAD_CONSTRUCTORS,
  LOAD_CONSTRUCTORS_ERROR,
  LOAD_DRIVERS_SUCCESS,
  LOAD_DRIVERS,
  LOAD_DRIVERS_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  constructors: [],
  drivers: [],
});

function searchReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case LOAD_CONSTRUCTORS:
      return state
        .set('loading', true)
        .set('error', false)
        .set('constructors', []);
    case LOAD_CONSTRUCTORS_SUCCESS:
      return state
        .set('constructors', action.constructors)
        .set('loading', false);
    case LOAD_CONSTRUCTORS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case LOAD_DRIVERS:
      console.log('3');
      return state
        .set('loading', true)
        .set('error', false)
        .set('drivers', []);
    case LOAD_DRIVERS_SUCCESS:
      return state
        .set('drivers', action.drivers)
        .set('loading', false);
    case LOAD_DRIVERS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default searchReducer;
