/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import { createStructuredSelector } from 'reselect';
import { Autocomplete, Button, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@utils/handleValue';
import ImageCarousel from './components/ImageCarousel';
import { selectLatestDateSchedule, selectStations } from './selectors';
import { getAllStations, getLatestDateSchedule } from './actions';

import classes from './style.module.scss';

const Home = ({ stations, latestDateSchedule }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const [inputs, setInputs] = useState({
    departureStation: null,
    arrivalStation: null,
    date: today,
  });

  const defaultProps = {
    options: stations,
    getOptionLabel: (option) => option.name,
  };

  const handleSwap = () => {
    const tempStation = inputs.departureStation;
    setInputs((prev) => ({ ...prev, departureStation: inputs.arrivalStation, arrivalStation: tempStation }));
  };

  const isDateAvailable = (date) => today <= date && date <= new Date(latestDateSchedule);

  const validateStations = () => {
    if (!inputs.departureStation) {
      toast.error('You need to choose departure station');
      return false;
    }
    if (!inputs.arrivalStation) {
      toast.error('You need to choose arrival station');
      return false;
    }
    if (inputs.departureStation.id === inputs.arrivalStation.id) {
      toast.error('Departure and Arrival station cannot be the same');
      return false;
    }
    return true;
  };

  const validateDate = () => {
    if (!inputs.date) {
      toast.error('You need to choose departure date');
      return false;
    }
    return true;
  };

  const validateInputs = () => {
    if (!validateStations() || !validateDate()) return false;
    return true;
  };

  const handleSearch = () => {
    if (!validateInputs()) return;
    navigate(`/schedule/${inputs.departureStation.id}/${inputs.arrivalStation.id}/${formatDate(inputs.date)}`);
  };

  useEffect(() => {
    dispatch(getAllStations());
    dispatch(getLatestDateSchedule());
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
          <div className={classes.row}>
            <div className={classes.inputDatePicker}>
              <label>Date</label>
              <DatePicker
                name="date"
                placeholderText="Select departure date"
                selected={inputs.date}
                dropdownMode="select"
                dateFormat="eee, dd MMM yyyy"
                filterDate={isDateAvailable}
                className={classes.datePicker}
                onChange={(date) => setInputs((prev) => ({ ...prev, date }))}
              />
            </div>
          </div>

          <Button variant="contained" className={classes.btn} onClick={handleSearch}>
            Search
          </Button>
        </section>
      </div>
    </main>
  );
};

Home.propTypes = {
  stations: PropTypes.array,
  latestDateSchedule: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  stations: selectStations,
  latestDateSchedule: selectLatestDateSchedule,
});

export default connect(mapStateToProps)(Home);
