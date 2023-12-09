/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';

import { createStructuredSelector } from 'reselect';
import { Autocomplete, TextField } from '@mui/material';
import classes from './style.module.scss';
import ImageCarousel from './components/ImageCarousel';
import { selectStations } from './selectors';
import { getAllStations } from './actions';

const Home = ({ stations }) => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    departureStation: null,
    arrivalStation: null,
    date: null,
  });

  const defaultProps = {
    options: stations,
    getOptionLabel: (option) => option.name,
  };

  const handleSwap = () => {
    const tempStation = inputs.departureStation;
    setInputs((prev) => ({ ...prev, departureStation: inputs.arrivalStation, arrivalStation: tempStation }));
  };

  useEffect(() => {
    dispatch(getAllStations());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={classes.main}>
      <ImageCarousel />
      <div className={classes.container}>
        <section>
          <div className={classes.row}>
            <div className={classes.input}>
              <label>From</label>
              <Autocomplete
                {...defaultProps}
                id="controlled-demo"
                value={inputs.departureStation}
                onChange={(event, newValue) => {
                  setInputs((prev) => ({ ...prev, departureStation: newValue }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select departure station" variant="standard" />
                )}
              />
            </div>
            <SwapHorizontalCircleIcon className={classes.icon} onClick={handleSwap} />
            <div className={classes.input}>
              <label>To</label>
              <Autocomplete
                {...defaultProps}
                id="controlled-demo"
                value={inputs.arrivalStation}
                onChange={(event, newValue) => {
                  setInputs((prev) => ({ ...prev, arrivalStation: newValue }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select arrival station" variant="standard" />
                )}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

Home.propTypes = {
  stations: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  stations: selectStations,
});

export default connect(mapStateToProps)(Home);
