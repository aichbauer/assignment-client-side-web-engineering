/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Autocomplete from 'react-predictive-input';
import PropTypes from 'prop-types';

import { makeSelectConstructors, makeSelectDrivers } from './selectors';
import { loadConstructors, loadDrivers } from './actions';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      searchData: [],
    };
  }

  componentWillMount() {
    this.props.getAllConstructors();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.constructors !== nextProps.constructors) {
      const searchArray = [];

      Object.entries(nextProps.constructors).map((item) => searchArray.push(item[1].name));

      this.setState({
        searchData: searchArray,
      });
    }
  }

  handleOnSelect(selected) {
    this.props.getAllDriversFromConstructor(selected);
  }

  render() {
    return (
      <div>
        <Autocomplete
          id="search"
          placeholder="Search"
          data={this.state.searchData}
          onSelected={(selected) => this.handleOnSelect(selected)}
        />
        <table>
          <thead>
            <tr>
              <td>Given Name</td>
              <td>Familyname</td>
              <td>Nationality</td>
              <td>Birthdate</td>
            </tr>
          </thead>
          <tbody>
            {
              Object.entries(this.props.drivers).map((item, idx) => {
                if (item[1] !== undefined) {
                  return (
                    <tr key={`${item[1].id} + ${idx}`}>
                      <td>{item[1].givenName}</td>
                      <td>{item[1].familyName}</td>
                      <td>{item[1].nationality}</td>
                      <td>{item[1].dateOfBirth}</td>
                    </tr>
                  );
                }

                return undefined;
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}


HomePage.propTypes = {
  constructors: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  drivers: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  getAllConstructors: PropTypes.func.isRequired,
  getAllDriversFromConstructor: PropTypes.func.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    getAllConstructors: () => dispatch(loadConstructors()),
    getAllDriversFromConstructor: (constructor) => dispatch(loadDrivers(constructor)),
  };
}

const mapStateToProps = createStructuredSelector({
  constructors: makeSelectConstructors(),
  drivers: makeSelectDrivers(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
