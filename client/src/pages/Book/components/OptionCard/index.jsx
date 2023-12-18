import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
    <div className={classes.available}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {available === 'Available' ? (
        <FormattedMessage id="app_available" />
      ) : available === 'Few' ? (
        <FormattedMessage id="app_few" />
      ) : (
        <FormattedMessage id="app_none" />
      )}
    </div>
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
