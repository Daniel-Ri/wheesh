/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import thinkingImage from '@static/images/thinking.svg';
import BackBtn from '@components/BackBtn';
import { createStructuredSelector } from 'reselect';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import { useMediaQuery } from 'react-responsive';
import { Autocomplete, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { formatDate } from '@utils/handleValue';
import { selectLocale } from '@containers/App/selectors';
import { enGB, id } from 'date-fns/locale';
import { selectLatestDateSchedule, selectSchedules, selectStations } from './selectors';
import { getAllStations, getLatestDateSchedule, getSchedules } from './actions';
import ScheduleCard from './components/ScheduleCard';

import classes from './style.module.scss';

const Schedule = ({ stations, latestDateSchedule, schedules, locale, intl: { formatMessage } }) => {
  const { departureStationId, arrivalStationId, date } = useParams();
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
    navigate(`/schedule/${inputs.arrivalStation.id}/${inputs.departureStation.id}/${formatDate(inputs.date)}`);
    setInputs((prev) => ({ ...prev, departureStation: inputs.arrivalStation, arrivalStation: tempStation }));
  };

  const isDateAvailable = (dateTime) => today <= dateTime && dateTime <= new Date(latestDateSchedule);

  useEffect(() => {
    dispatch(getAllStations());
    dispatch(getLatestDateSchedule());
    setInputs((prev) => ({ ...prev, date: new Date(date) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      departureStation: stations.filter((station) => station.id === parseInt(departureStationId, 10))[0],
      arrivalStation: stations.filter((station) => station.id === parseInt(arrivalStationId, 10))[0],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations]);

  useEffect(() => {
    dispatch(getSchedules(departureStationId, arrivalStationId, date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departureStationId, arrivalStationId, date]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/')} />
          <h1>
            <FormattedMessage id="app_schedule" />
          </h1>
        </header>
        <div className={classes.filter}>
          <div className={classes.row}>
            <div className={classes.input}>
              <label>
                <FormattedMessage id="app_from" />
              </label>
              <Autocomplete
                {...defaultProps}
                id="controlled-demo"
                value={inputs.departureStation || null}
                onChange={(event, newValue) => {
                  if (!newValue) return;
                  if (newValue.id === parseInt(arrivalStationId, 10)) {
                    toast.error(formatMessage({ id: 'app_departure_arrival_cannot_same' }));
                    return;
                  }
                  navigate(`/schedule/${newValue.id}/${inputs.arrivalStation.id}/${formatDate(inputs.date)}`);
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
                value={inputs.arrivalStation || null}
                onChange={(event, newValue) => {
                  if (!newValue) return;
                  if (newValue.id === parseInt(departureStationId, 10)) {
                    toast.error(formatMessage({ id: 'app_departure_arrival_cannot_same' }));
                    return;
                  }
                  navigate(`/schedule/${inputs.departureStation.id}/${newValue.id}/${formatDate(inputs.date)}`);
                  setInputs((prev) => ({ ...prev, arrivalStation: newValue }));
                }}
                className={classes.inputAutocomplete}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select arrival station" variant="standard" />
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
                  onChange={(datetime) => {
                    navigate(
                      `/schedule/${inputs.departureStation.id}/${inputs.arrivalStation.id}/${formatDate(datetime)}`
                    );
                    setInputs((prev) => ({ ...prev, date: datetime }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={classes.schedules}>
          {schedules.length === 0 ? (
            <div className={classes.sectionImage}>
              <div className={classes.image}>
                <img src={thinkingImage} alt="Thinking" />
              </div>
              <div className={classes.message}>
                <FormattedMessage id="app_no_schedules" />
              </div>
            </div>
          ) : (
            schedules.map((schedule) => <ScheduleCard key={schedule.id} schedule={schedule} />)
          )}
        </div>
      </div>
    </main>
  );
};

Schedule.propTypes = {
  stations: PropTypes.array,
  latestDateSchedule: PropTypes.string,
  schedules: PropTypes.array,
  locale: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  stations: selectStations,
  latestDateSchedule: selectLatestDateSchedule,
  schedules: selectSchedules,
  locale: selectLocale,
});

export default injectIntl(connect(mapStateToProps)(Schedule));
