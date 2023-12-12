import PropTypes from 'prop-types';

import classes from './style.module.scss';

const OptionCard = ({ seatClass, price, available, isSelected, onClick }) => (
  <div
    className={`${classes.optionCard}  ${isSelected ? classes.selected : ''} ${
      available === 'None' ? classes.disabled : ''
    }`}
    onClick={onClick}
  >
    <div className={classes.price}>{price}</div>
    <div className={classes.seatClass}>{seatClass} Class</div>
    <div className={classes.available}>{available}</div>
  </div>
);

OptionCard.propTypes = {
  seatClass: PropTypes.string,
  price: PropTypes.string,
  available: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OptionCard;
