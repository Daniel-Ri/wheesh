import PropTypes from 'prop-types';

import { censorIdCard, formatRupiah } from '@utils/handleValue';
import classes from './style.module.scss';

const OrderedSeatCard = ({ orderedSeat, addLine }) => (
  <>
    <div className={classes.card}>
      <div className={classes.leftCard}>
        <div className={classes.name}>{orderedSeat.name}</div>
        <div className={classes.description}>
          <div>ID Card</div>
          <div>{censorIdCard(orderedSeat.idCard)}</div>
        </div>
        <div className={classes.description}>
          <div>Coach {String(orderedSeat.Seat.Carriage.carriageNumber).padStart(2, '0')}</div>
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
