import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
import arrowImage from '@static/images/arrowTrain.png';

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
    <div className={classes.card} onClick={handleClickCard}>
      <div className={classes.stations}>
        <div className={classes.stationName}>{order.Schedule.departureStation.name}</div>
        <div className={classes.train}>
          <div className={classes.name}>{order.Schedule.Train.name}</div>
          <div className={classes.arrowImage}>
            <img src={arrowImage} alt="" />
          </div>
        </div>
        <div className={classes.stationName}>{order.Schedule.arrivalStation.name}</div>
      </div>
      <div className={classes.timeDesc}>
        Departure: {formatHour(order.Schedule.departureTime)} {formatOrderDate(order.Schedule.departureTime)}
      </div>
      <div className={classes.timeDesc}>
        Order Time: {formatHour(order.createdAt)} {formatOrderDate(order.createdAt)}
      </div>
      <div className={classes.tickets}>
        {order.OrderedSeats.length} ticket{order.OrderedSeats.length > 1 ? 's' : ''}{' '}
        {order.OrderedSeats.map((orderedSeat) => orderedSeat.name).join(', ')}
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderCard;
