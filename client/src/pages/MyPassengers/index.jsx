import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import BackBtn from '@components/BackBtn';
import { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { getMyPassengers } from './actions';
import { selectMyPassengers } from './selectors';
import PassengerCard from './components/PassengerCard';

import classes from './style.module.scss';

const MyPassengers = ({ myPassengers }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMyPassengers());
  }, []);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>My Passengers</h1>
        </header>
        <div className={classes.message}>{myPassengers.length}/15 (Up to 15 passengers can be added)</div>
        {myPassengers.length < 15 && (
          <Button variant="outlined" className={classes.addBtn} onClick={() => navigate('/createPassenger')}>
            <AddCircleOutlineIcon />
            <div className={classes.name}>Add Passenger</div>
          </Button>
        )}
        <div className={classes.passengers}>
          {myPassengers.map((passenger) => (
            <PassengerCard key={passenger.id} passenger={passenger} />
          ))}
        </div>
      </div>
    </main>
  );
};

MyPassengers.propTypes = {
  myPassengers: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  myPassengers: selectMyPassengers,
});

export default connect(mapStateToProps)(MyPassengers);
