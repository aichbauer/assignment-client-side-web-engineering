import {
  LOAD_CONSTRUCTORS,
  LOAD_CONSTRUCTORS_SUCCESS,
  LOAD_CONSTRUCTORS_ERROR,
  LOAD_DRIVERS,
  LOAD_DRIVERS_SUCCESS,
  LOAD_DRIVERS_ERROR,
} from './constants';

export const loadConstructors = () => ({
  type: LOAD_CONSTRUCTORS,
});

export const constructorsLoaded = (constructors) => ({
  type: LOAD_CONSTRUCTORS_SUCCESS,
  constructors,
});

export const constructorsError = (error) => ({
  type: LOAD_CONSTRUCTORS_ERROR,
  error,
});

export const loadDrivers = (constructor) => ({
  type: LOAD_DRIVERS,
  constructor,
});

export const driversLoaded = (drivers) => ({
  type: LOAD_DRIVERS_SUCCESS,
  drivers,
});

export const driversError = (error) => ({
  type: LOAD_CONSTRUCTORS_ERROR,
  error,
});

