/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import { useMediaQuery } from 'react-responsive';
import { createStructuredSelector } from 'reselect';
import { Autocomplete, Button, TextField } from '@mui/material';
import { enGB, id } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@utils/handleValue';
import { selectLocale } from '@containers/App/selectors';
import ImageCarousel from './components/ImageCarousel';
import { selectBanners, selectLatestDateSchedule, selectStations } from './selectors';
import { getAllStations, getBanners, getLatestDateSchedule } from './actions';

import classes from './style.module.scss';

const Home = ({ stations, latestDateSchedule, banners, locale, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const [inputs, setInputs] = useState({
    departureStation: null,
    arrivalStation: null,
    date: today,
  });

  const isMDMaxSize = useMediaQuery({ query: '(max-width: 768px)' });

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
      toast.error(formatMessage({ id: 'app_need_to_choose_departure' }));
      return false;
    }
    if (!inputs.arrivalStation) {
      toast.error(formatMessage({ id: 'app_need_to_choose_arrival' }));
      return false;
    }
    if (inputs.departureStation.id === inputs.arrivalStation.id) {
      toast.error(formatMessage({ id: 'app_departure_arrival_cannot_same' }));
      return false;
    }
    return true;
  };

  const validateDate = () => {
    if (!inputs.date) {
      toast.error(formatMessage({ id: 'app_need_choose_departure_date' }));
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
    dispatch(getBanners());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={classes.main}>
      <ImageCarousel banners={banners} />
      <div className={classes.container}>
        <section>
          <div className={classes.row}>
            <div className={classes.input}>
              <label>
                <FormattedMessage id="app_from" />
              </label>
              <Autocomplete
                {...defaultProps}
                id="controlled-demo"
                value={inputs.departureStation}
                onChange={(event, newValue) => {
                  setInputs((prev) => ({ ...prev, departureStation: newValue }));
                }}
                className={classes.inputAutocomplete}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={formatMessage({ id: 'app_select_departure_station' })}
                    variant="standard"
                  />
                )}
              />
            </div>
            {isMDMaxSize ? (
              <SwapVerticalCircleIcon className={classes.icon} onClick={handleSwap} />
            ) : (
              <SwapHorizontalCircleIcon className={classes.icon} onClick={handleSwap} />
            )}
            <div className={classes.input}>
              <label>
                <FormattedMessage id="app_to" />
              </label>
              <Autocomplete
                {...defaultProps}
                id="controlled-demo"
                value={inputs.arrivalStation}
                onChange={(event, newValue) => {
                  setInputs((prev) => ({ ...prev, arrivalStation: newValue }));
                }}
                className={classes.inputAutocomplete}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={formatMessage({ id: 'app_select_arrival_station' })}
                    variant="standard"
                  />
                )}
              />
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.inputDatePicker}>
              <label>
                <FormattedMessage id="app_date" />
              </label>
              <div className={classes.datePickerWrapper}>
                <DatePicker
                  name="date"
                  locale={locale === 'id' ? id : enGB}
                  placeholderText={formatMessage({ id: 'app_select_departure_date' })}
                  selected={inputs.date}
                  dropdownMode="select"
                  dateFormat="eee, dd MMM yyyy"
                  filterDate={isDateAvailable}
                  className={classes.datePicker}
                  onChange={(date) => setInputs((prev) => ({ ...prev, date }))}
                />
              </div>
            </div>
          </div>

          <Button variant="contained" className={classes.btn} onClick={handleSearch}>
            <FormattedMessage id="app_search" />
          </Button>
        </section>
      </div>
    </main>
  );
};

Home.propTypes = {
  stations: PropTypes.array,
  latestDateSchedule: PropTypes.string,
  banners: PropTypes.array,
  locale: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  stations: selectStations,
  latestDateSchedule: selectLatestDateSchedule,
  banners: selectBanners,
  locale: selectLocale,
});

export default injectIntl(connect(mapStateToProps)(Home));
