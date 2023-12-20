import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { getMyPassengers, setPassengerIds, setStep } from './actions';

import ClassAndPassenger from './components/ClassAndPassenger';
import ChooseSeat from './components/ChooseSeat';
import { selectStep } from './selectors';

import classes from './style.module.scss';

const Book = ({ step }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyPassengers());
    dispatch(setPassengerIds([]));
    dispatch(setStep(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main data-testid="Book" className={classes.main}>
      <div className={classes.container}>
        {(() => {
          switch (step) {
            case 0:
              return <ClassAndPassenger />;
            case 1:
              return <ChooseSeat />;
          }
        })()}
      </div>
    </main>
  );
};

Book.propTypes = {
  step: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  step: selectStep,
});

export default connect(mapStateToProps)(Book);
