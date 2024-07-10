import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import BackBtn from '@components/BackBtn';
import { createOrder, getSchedule, setChosenSeats, setPassengerIds, setStep } from '@pages/Book/actions';
import { createStructuredSelector } from 'reselect';
import {
  selectChosenSeats,
  selectMyPassengers,
  selectPassengerIds,
  selectSchedule,
  selectStep,
} from '@pages/Book/selectors';
import { Button } from '@mui/material';
import { formatDateWithDay, formatHour } from '@utils/handleValue';
import arrowImage from '@static/images/arrowTrain.png';

import toast from 'react-hot-toast';
import { selectLocale } from '@containers/App/selectors';
import CornerCarriage from '../CornerCarriage';
import CenterCarriage from '../CenterCarriage';
import RowPassenger from '../RowPassenger';

import classes from './style.module.scss';

const ChooseSeat = ({ step, schedule, myPassengers, passengerIds, chosenSeats, locale, intl: { formatMessage } }) => {
  const { scheduleId, seatClass } = useParams();

  const [activePassengerId, setActivePassengerId] = useState(passengerIds[0]);
  const [availableCarriages, setAvailableCarriages] = useState([]);
  const [activeCarriageNumber, setActiveCarriageNumber] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickPassenger = (passengerId) => {
    setActivePassengerId(passengerId);
  };

  const handleClickCarriage = (carriageNumber) => {
    setActiveCarriageNumber(carriageNumber);
  };

  const handleAddOrUpdateSeat = (passengerId, carriageNumber, seatNumber, seatId) => {
    const newChosenSeats = new Map(chosenSeats);
    newChosenSeats.set(passengerId, { carriageNumber, seatNumber, seatId });
    dispatch(setChosenSeats(newChosenSeats));
  };

  const renderActiveCarriage = () => {
    const activeCarriage = availableCarriages?.find((carriage) => carriage.carriageNumber === activeCarriageNumber);

    if (activeCarriageNumber === 1 || activeCarriageNumber === 8) {
      return (
        <CornerCarriage
          activePassengerId={activePassengerId}
          carriageNumber={activeCarriage?.carriageNumber}
          seats={activeCarriage?.Seats}
          handleAddOrUpdateSeat={handleAddOrUpdateSeat}
        />
      );
      // eslint-disable-next-line no-else-return
    } else {
      return (
        <CenterCarriage
          activePassengerId={activePassengerId}
          carriageNumber={activeCarriage?.carriageNumber}
          seats={activeCarriage?.Seats}
          handleAddOrUpdateSeat={handleAddOrUpdateSeat}
        />
      );
    }
  };

  const handleErrorOrder = (errorRes) => {
    if (errorRes.status === 403) {
      // Train will depart in less than 30 minutes
      toast.error(errorRes.data.message);
      navigate('/');
    } else if (errorRes.status === 409) {
      toast.error(formatMessage({ id: 'app_seat_has_been_booked' }));
      dispatch(setPassengerIds([]));
      dispatch(setStep(0));
      dispatch(getSchedule(scheduleId));
    } else {
      toast.error(errorRes.data.message);
    }
  };

  const handleSuccessOrder = (response) => {
    toast.success(formatMessage({ id: 'app_success_book_the_seats' }));
    navigate(`/unpaid/${response.data}`);
  };

  const handleCreateOrder = () => {
    if (chosenSeats.size !== passengerIds.length) {
      toast.error(formatMessage({ id: 'app_need_select_all_seat' }));
      return;
    }

    const orderedSeats = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of chosenSeats) {
      orderedSeats.push({
        seatId: value.seatId,
        passengerId: key,
      });
    }

    // eslint-disable-next-line prettier/prettier
    const formattedInputs = { scheduleId, orderedSeats };
    dispatch(createOrder(formattedInputs, handleSuccessOrder, handleErrorOrder));
  };

  useEffect(() => {
    const carriages = schedule?.carriages.filter((carriage) =>
      carriage.Seats.some((seat) => seat.seatClass === seatClass && !seat.isBooked)
    );
    setAvailableCarriages(carriages);
    setActiveCarriageNumber(carriages[0].carriageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <>
      <header>
        <BackBtn handleClickBack={() => dispatch(setStep(0))} />
        <h1>
          <FormattedMessage id="app_choose_seat" />
        </h1>
      </header>

      <section>
        <div className={classes.sectionDesc}>
          <div className={classes.row}>
            <div className={classes.train}>{schedule?.Train.name}</div>
            <div className={classes.place}>{schedule?.departureStation.name}</div>
            <div className={classes.time}>({formatHour(schedule?.departureTime)})</div>
            <div className={classes.arrowImage}>
              <img src={arrowImage} alt="" />
            </div>
            <div className={classes.place}>{schedule?.arrivalStation.name}</div>
            <div className={classes.time}>({formatHour(schedule?.arrivalTime)})</div>
          </div>
          <div className={classes.row}>
            <div className={classes.dateTime}>{formatDateWithDay(schedule?.departureTime, locale)}</div>
          </div>
          <table className={classes.passengers}>
            <tbody>
              <tr>
                <th>
                  <FormattedMessage id="app_passenger_name" />
                </th>
                <th>
                  <FormattedMessage id="app_selected_seats" />
                </th>
              </tr>
              {passengerIds.map((passengerId) => (
                <RowPassenger
                  key={passengerId}
                  passenger={myPassengers.find((passenger) => passenger.id === passengerId)}
                  chosenSeat={chosenSeats.get(passengerId)}
                  isActive={activePassengerId === passengerId}
                  onClick={() => handleClickPassenger(passengerId)}
                />
              ))}
            </tbody>
          </table>

          <div className={classes.row}>
            <FormattedMessage id="app_select_carriage" />
          </div>
          <div className={classes.carriages}>
            {availableCarriages.map((carriage) => (
              <div
                key={carriage.id}
                className={`${classes.card} ${
                  activeCarriageNumber === parseInt(carriage.carriageNumber, 10) ? classes.active : ''
                }`}
                onClick={() => handleClickCarriage(carriage.carriageNumber)}
              >
                {String(carriage.carriageNumber).padStart(2, '0')}
              </div>
            ))}
          </div>

          <div className={classes.selectSeat}>
            <div className={classes.header}>
              <FormattedMessage id="app_select_seat" />
            </div>
            <div className={classes.message}>
              <b>
                {chosenSeats.size}/{passengerIds.length}
              </b>{' '}
              <FormattedMessage id="app_has_been_selected" />
            </div>
          </div>

          <div className={classes.train}>{renderActiveCarriage()}</div>
        </div>
      </section>
      <div className={classes.footer}>
        <Button variant="contained" className={classes.btn} onClick={handleCreateOrder}>
          <FormattedMessage id="app_submit" />
        </Button>
      </div>
    </>
  );
};

ChooseSeat.propTypes = {
  step: PropTypes.number.isRequired,
  schedule: PropTypes.object,
  myPassengers: PropTypes.array,
  passengerIds: PropTypes.array,
  chosenSeats: PropTypes.instanceOf(Map),
  locale: PropTypes.string.isRequired,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  step: selectStep,
  schedule: selectSchedule,
  myPassengers: selectMyPassengers,
  passengerIds: selectPassengerIds,
  chosenSeats: selectChosenSeats,
  locale: selectLocale,
});

export default injectIntl(connect(mapStateToProps)(ChooseSeat));
