/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const homeState = (state) => state.get('home');


const makeSelectConstructors = () => createSelector(
  homeState,
  (home) => home.get('constructors')
);

const makeSelectDrivers = () => createSelector(
  homeState,
  (home) => home.get('drivers')
);

export {
  homeState,
  makeSelectDrivers,
  makeSelectConstructors,
};
