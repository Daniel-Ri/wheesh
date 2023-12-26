import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { createStructuredSelector } from 'reselect';
import { selectChosenSeats, selectMyPassengers } from '@pages/Book/selectors';
import { connect } from 'react-redux';

import { convertChosenSeats } from '@utils/handleValue';

import classes from './style.module.scss';

const CornerCarriage = ({
  seats,
  activePassengerId,
  carriageNumber,
  myPassengers,
  chosenSeats,
  handleAddOrUpdateSeat,
}) => {
  const { seatClass } = useParams();

  // convertedChoosenSeats: Map(key: seatId, value: passengerId)
  const convertedChosenSeats = convertChosenSeats(chosenSeats);

  const findSeat = (seatNumber) => seats?.find((seat) => seat.seatNumber === seatNumber);
  const isSeatNotAvailable = (seat) => seat?.isBooked || seat?.seatClass !== seatClass;
  const isSeatChosen = (seat) => convertedChosenSeats.get(seat?.id);
  const getAbbre = (seat) => {
    const passengerId = convertedChosenSeats.get(seat.id);
    const abbrePassenger = myPassengers.find((passenger) => passenger.id === passengerId).name[0];

    return abbrePassenger;
  };

  const firstSeats = ['1A', '1C', '1F', '2A', '2C', '2F', '3A', '3C', '3F'];
  const businessSeats = [
    // eslint-disable-next-line prettier/prettier
    '4A', '4C', '4D', '4F', '5A', '5C', '5D', '5F', '6A', '6C', '6D', '6F', '7A', '7C', '7D', '7F', '8A', '8C', '8D', '8F',
    // eslint-disable-next-line prettier/prettier
    '9A', '9C', '9D', '9F', '10A', '10C', '10D', '10F'
  ];

  return (
    <div className={classes.cornerCarriage}>
      <div className={classes.firstSection}>
        <div className={classes.aisleFirst}>
          <div>
            <FormattedMessage id="app_aisle" />
          </div>
          <div>
            <FormattedMessage id="app_aisle" />
          </div>
        </div>
        {firstSeats.map((seatNumber) => (
          <div key={seatNumber} className={classes.seat}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isSeatNotAvailable(findSeat(seatNumber)) ? (
              <div className={`${classes.chair} ${classes.notAvailable}`}>
                <CancelOutlinedIcon />
              </div>
            ) : isSeatChosen(findSeat(seatNumber)) ? (
              <div className={`${classes.chair} ${classes.chosen}`}>
                <div className={classes.seatNumber}>{seatNumber}</div>
                <div className={classes.abbre}>{getAbbre(findSeat(seatNumber))}</div>
              </div>
            ) : (
              <div
                className={classes.chair}
                onClick={() =>
                  handleAddOrUpdateSeat(activePassengerId, carriageNumber, seatNumber, findSeat(seatNumber).id)
                }
              >
                {seatNumber}
              </div>
            )}
          </div>
        ))}
      </div>
      <hr />
      <div className={classes.businessSection}>
        <div className={classes.aisleBusiness}>
          <div>
            <FormattedMessage id="app_aisle" />
          </div>
          <div>
            <FormattedMessage id="app_aisle" />
          </div>
        </div>
        {businessSeats.map((seatNumber) => (
          <div key={seatNumber} className={classes.seat}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isSeatNotAvailable(findSeat(seatNumber)) ? (
              <div className={`${classes.chair} ${classes.notAvailable}`}>
                <CancelOutlinedIcon />
              </div>
            ) : isSeatChosen(findSeat(seatNumber)) ? (
              <div className={`${classes.chair} ${classes.chosen}`}>
                <div className={classes.seatNumber}>{seatNumber}</div>
                <div className={classes.abbre}>{getAbbre(findSeat(seatNumber))}</div>
              </div>
            ) : (
              <div
                className={classes.chair}
                onClick={() =>
                  handleAddOrUpdateSeat(activePassengerId, carriageNumber, seatNumber, findSeat(seatNumber).id)
                }
              >
                {seatNumber}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

CornerCarriage.propTypes = {
  seats: PropTypes.array,
  activePassengerId: PropTypes.number.isRequired,
  carriageNumber: PropTypes.number,
  myPassengers: PropTypes.array,
  chosenSeats: PropTypes.instanceOf(Map),
  handleAddOrUpdateSeat: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  myPassengers: selectMyPassengers,
  chosenSeats: selectChosenSeats,
});

export default connect(mapStateToProps)(CornerCarriage);
