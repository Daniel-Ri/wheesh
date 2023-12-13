import PropTypes from 'prop-types';

import classes from './style.module.scss';

const RowPassenger = ({ passenger, chosenSeat, isActive, onClick }) => {
  const chosenSeatString = chosenSeat
    ? `${String(chosenSeat.carriageNumber).padStart(2, '0')}-${chosenSeat.seatNumber}`
    : '';

  return (
    <tr className={`${classes.rowPassenger} ${isActive ? classes.activeRow : ''}`} onClick={onClick}>
      <td className={classes.passenger}>
        <input type="radio" onChange={() => {}} checked={isActive} />
        <div className={classes.name}>{passenger.name}</div>
      </td>
      <td>{chosenSeatString}</td>
    </tr>
  );
};

RowPassenger.propTypes = {
  passenger: PropTypes.object.isRequired,
  chosenSeat: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RowPassenger;
