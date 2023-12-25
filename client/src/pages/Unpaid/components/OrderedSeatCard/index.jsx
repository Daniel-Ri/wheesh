import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { censorIdCard, formatRupiah } from '@utils/handleValue';
import classes from './style.module.scss';

const OrderedSeatCard = ({ orderedSeat, addLine }) => (
  <>
    <div data-testid="OrderedSeatCard" className={classes.card}>
      <div className={classes.leftCard}>
        <div className={classes.name}>{orderedSeat.name}</div>
        <div className={classes.description}>
          <div>
            <FormattedMessage id="app_id_card" />
          </div>
          <div>{censorIdCard(orderedSeat.idCard)}</div>
        </div>
        <div className={classes.description}>
          <div>
            <FormattedMessage id="app_coach" /> {String(orderedSeat.Seat.Carriage.carriageNumber).padStart(2, '0')}
          </div>
          <div>|</div>
          <div className={classes.seatClass}>{orderedSeat.Seat.seatClass} class</div>
          <div>{orderedSeat.Seat.seatNumber}</div>
        </div>
      </div>
      <div className={classes.price}>{formatRupiah(orderedSeat.price)}</div>
    </div>
    {addLine && <hr />}
  </>
);

OrderedSeatCard.propTypes = {
  orderedSeat: PropTypes.object.isRequired,
  addLine: PropTypes.bool,
};

export default OrderedSeatCard;
