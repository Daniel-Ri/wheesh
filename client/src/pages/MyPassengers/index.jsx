import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main data-testid="MyPassengers" className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/me')} />
          <h1>
            <FormattedMessage id="app_my_passengers" />
          </h1>
        </header>
        <div className={classes.message}>
          {myPassengers.length}/15 <FormattedMessage id="app_up_to_15_passengers" />
        </div>
        {myPassengers.length < 15 && (
          <Button variant="outlined" className={classes.addBtn} onClick={() => navigate('/createPassenger')}>
            <AddCircleOutlineIcon />
            <div className={classes.name}>
              <FormattedMessage id="app_add_passenger" />
            </div>
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
