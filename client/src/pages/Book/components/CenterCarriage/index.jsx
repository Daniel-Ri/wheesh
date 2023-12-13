import PropTypes from 'prop-types';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectChosenSeats, selectMyPassengers } from '@pages/Book/selectors';
import { connect } from 'react-redux';
import { convertChosenSeats } from '@utils/handleValue';
import classes from './style.module.scss';

const CenterCarriage = ({
  seats,
  activePassengerId,
  carriageNumber,
  myPassengers,
  chosenSeats,
  handleAddOrUpdateSeat,
}) => {
  const { seatClass } = useParams();
  const convertedChosenSeats = convertChosenSeats(chosenSeats);

  const findSeat = (seatNumber) => seats?.find((seat) => seat.seatNumber === seatNumber);
  const isSeatNotAvailable = (seat) => seat?.isBooked || seat?.seatClass !== seatClass;
  const isSeatChosen = (seat) => convertedChosenSeats.get(seat?.id);
  const getAbbre = (seat) => {
    const passengerId = convertedChosenSeats.get(seat.id);
    const abbrePassenger = myPassengers.find((passenger) => passenger.id === passengerId).name[0];

    return abbrePassenger;
  };

  const economySeats = [
    // eslint-disable-next-line prettier/prettier
    '1A', '1B', '1C', '1D', '1F', '2A', '2B', '2C', '2D', '2F', '3A', '3B', '3C', '3D', '3F',
    // eslint-disable-next-line prettier/prettier
    '4A', '4B', '4C', '4D', '4F', '5A', '5B', '5C', '5D', '5F', '6A', '6B', '6C', '6D', '6F',
    // eslint-disable-next-line prettier/prettier
    '7A', '7B', '7C', '7D', '7F', '8A', '8B', '8C', '8D', '8F', '9A', '9B', '9C', '9D', '9F',
    // eslint-disable-next-line prettier/prettier
    '10A', '10B', '10C', '10D', '10F', '11A', '11B', '11C', '11D', '11F', '12A', '12B', '12C', '12D', '12F',
    // eslint-disable-next-line prettier/prettier
    '13A', '13B', '13C', '13D', '13F', '14A', '14B', '14C', '14D', '14F', '15A', '15B', '15C', '15D', '15F',
    // eslint-disable-next-line prettier/prettier
    '16A', '16B', '16C', '16D', '16F', '17A', '17B', '17C', '17D', '17F', '18A', '18B', '18C', '18D', '18F'
  ];

  return (
    <div className={classes.centerCarriage}>
      <div className={classes.seats}>
        <div className={classes.aisle}>
          <div>AISLE</div>
          <div>AISLE</div>
        </div>
        {economySeats.map((seatNumber) => (
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

CenterCarriage.propTypes = {
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

export default connect(mapStateToProps)(CenterCarriage);
