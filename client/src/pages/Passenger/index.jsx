/* eslint-disable no-nested-ternary */
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

import BackBtn from '@components/BackBtn';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createStructuredSelector } from 'reselect';
import classes from './style.module.scss';
import { deletePassenger, getPassenger } from './actions';
import { selectPassenger } from './selectors';
import NonEditable from './components/NonEditable';
import Editable from './components/Editable';
import ReminderDialog from './components/ReminderDialog';

const Passenger = ({ passenger }) => {
  const { passengerId } = useParams();
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleErrorGetPassenger = (errorMsg) => {
    toast.error(errorMsg);
    navigate('/myPassengers');
  };

  const handleSuccessDelete = () => {
    toast.success('Success delete passenger');
    navigate('/myPassengers');
  };

  const handleErrorDelete = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickDeleteButton = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    dispatch(deletePassenger(passengerId, handleSuccessDelete, handleErrorDelete));
  };

  useEffect(() => {
    dispatch(getPassenger(passengerId, handleErrorGetPassenger));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passengerId]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/myPassengers')} />
          <div className={classes.empty} />
          <h1>Passenger</h1>
          {passenger && !passenger.isUser ? (
            <div className={classes.delete} onClick={handleClickDeleteButton}>
              Delete
            </div>
          ) : (
            <div className={classes.empty} />
          )}
        </header>

        {!passenger ? (
          <div />
        ) : passenger.isUser ? (
          <NonEditable passenger={passenger} />
        ) : (
          <Editable passenger={passenger} />
        )}
      </div>
      <ReminderDialog open={open} handleClose={handleClose} handleDelete={handleDelete} />
    </main>
  );
};

Passenger.propTypes = {
  passenger: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  passenger: selectPassenger,
});

export default connect(mapStateToProps)(Passenger);
