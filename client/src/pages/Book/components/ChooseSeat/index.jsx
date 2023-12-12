import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import BackBtn from '@components/BackBtn';
import { setStep } from '@pages/Book/actions';
import { createStructuredSelector } from 'reselect';
import { selectMyPassengers, selectPassengerIds, selectSchedule } from '@pages/Book/selectors';
import { Button } from '@mui/material';
import classes from './style.module.scss';
import CornerCarriage from '../CornerCarriage';
import CenterCarriage from '../CenterCarriage';

const ChooseSeat = ({ schedule, myPassengers, passengerIds }) => {
  const { scheduleId, seatClass } = useParams();

  console.log(schedule, '<< SCHEDULE');
  console.log(myPassengers, '<< MY PASSENGERS');
  console.log(passengerIds, '<< PASSENGER IDS');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <header>
        <BackBtn handleClickBack={() => dispatch(setStep(0))} />
        <h1>Choose Seat</h1>
      </header>
      <CornerCarriage />
      <CenterCarriage />
      <div className={classes.footer}>
        <Button>Submit</Button>
      </div>
    </>
  );
};

ChooseSeat.propTypes = {
  schedule: PropTypes.object,
  myPassengers: PropTypes.array,
  passengerIds: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  schedule: selectSchedule,
  myPassengers: selectMyPassengers,
  passengerIds: selectPassengerIds,
});

export default connect(mapStateToProps)(ChooseSeat);
