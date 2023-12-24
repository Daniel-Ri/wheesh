import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { formatHour, formatOrderDate } from '@utils/handleValue';

import classes from './style.module.scss';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const handleClickCard = () => {
    if (!order.Payment.isPaid) {
      navigate(`/unpaid/${order.id}`);
    } else if (new Date(order.Schedule.arrivalTime) >= new Date(new Date() - 6 * 60 * 60 * 1000)) {
      navigate(`/order/${order.id}`);
    } else {
      navigate(`/history/${order.id}`);
    }
  };

  return (
    <div data-testid="OrderCard" className={classes.card} onClick={handleClickCard}>
      <div className={classes.stations}>
        <div className={classes.stationName}>{order.Schedule.departureStation.name}</div>
        <div className={classes.train}>
          <div className={classes.name}>{order.Schedule.Train.name}</div>
          <div className={classes.arrowImage}>
            <img src="/arrowTrain.png" alt="" />
          </div>
        </div>
        <div className={classes.stationName}>{order.Schedule.arrivalStation.name}</div>
      </div>
      <div className={classes.timeDesc}>
        <FormattedMessage id="app_departure" />: {formatHour(order.Schedule.departureTime)}{' '}
        {formatOrderDate(order.Schedule.departureTime)}
      </div>
      <div className={classes.timeDesc}>
        <FormattedMessage id="app_order_time" />: {formatHour(order.createdAt)} {formatOrderDate(order.createdAt)}
      </div>
      <div className={classes.tickets}>
        {order.OrderedSeats.length}{' '}
        {order.OrderedSeats.length > 1 ? <FormattedMessage id="app_tickets" /> : <FormattedMessage id="app_ticket" />}{' '}
        {order.OrderedSeats.map((orderedSeat) => orderedSeat.name).join(', ')}
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderCard;
