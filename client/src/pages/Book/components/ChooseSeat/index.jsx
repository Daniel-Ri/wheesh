import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import BackBtn from '@components/BackBtn';
import { createOrder, getSchedule, setChosenSeats, setStep } from '@pages/Book/actions';
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
import CornerCarriage from '../CornerCarriage';
import CenterCarriage from '../CenterCarriage';

import classes from './style.module.scss';
import RowPassenger from '../RowPassenger';

const ChooseSeat = ({ step, schedule, myPassengers, passengerIds, chosenSeats }) => {
  const { scheduleId, seatClass } = useParams();

  const [activePassengerId, setActivePassengerId] = useState(passengerIds[0]);
  const [availableCarriages, setAvailableCarriages] = useState([]);
  const [activeCarriageNumber, setActiveCarriageNumber] = useState(0);

  console.log(schedule, '<< SCHEDULE');
  console.log(myPassengers, '<< MY PASSENGERS');
  console.log(passengerIds, '<< PASSENGER IDS');
  console.log(chosenSeats, '<< CHOSEN SEATS');
  console.log(availableCarriages, '<< AVAILABLE CARRIAGES');
  console.log(activeCarriageNumber, '<< ACTIVE CARRIAGE NUMBER');

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
    if (errorRes.status === 409) {
      toast.error('Your seat has been booked by other users');
      dispatch(setStep(0));
      dispatch(getSchedule(scheduleId));
    } else {
      toast.error(errorRes.data.message);
    }
  };

  const handleSuccessOrder = (response) => {
    toast.success('Success book the seats');
    navigate(`/unpaid/${response.data}`);
  };

  const handleCreateOrder = () => {
    if (chosenSeats.size !== passengerIds.length) {
      toast.error("You need to select your all passenger's seat");
      return;
    }

    const formattedOrderedSeats = [];
    console.log(chosenSeats, '<<<< CHOSEN');
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of chosenSeats) {
      formattedOrderedSeats.push({
        seatId: value.seatId,
        passengerId: key,
      });
    }

    console.log(formattedOrderedSeats, '<< ORDERED SEATS');

    // eslint-disable-next-line prettier/prettier
    const formattedInputs = { scheduleId, "orderedSeats": formattedOrderedSeats };
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
        <h1>Choose Seat</h1>
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
            <div className={classes.dateTime}>{formatDateWithDay(schedule?.departureTime)}</div>
          </div>
          <table className={classes.passengers}>
            <tbody>
              <tr>
                <th>Passenger Name</th>
                <th>Selected Seats</th>
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

          <div className={classes.row}>Select carriage</div>
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
            <div className={classes.header}>Select Seat</div>
            <div className={classes.message}>
              <b>
                {chosenSeats.size}/{passengerIds.length}
              </b>{' '}
              has been selected
            </div>
          </div>

          <div className={classes.train}>{renderActiveCarriage()}</div>
        </div>
      </section>
      <div className={classes.footer}>
        <Button variant="contained" className={classes.btn} onClick={handleCreateOrder}>
          Submit
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
};

const mapStateToProps = createStructuredSelector({
  step: selectStep,
  schedule: selectSchedule,
  myPassengers: selectMyPassengers,
  passengerIds: selectPassengerIds,
  chosenSeats: selectChosenSeats,
});

export default connect(mapStateToProps)(ChooseSeat);
