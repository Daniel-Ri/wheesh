import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

import arrowImage from '@static/images/arrowTrain.png';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import BackBtn from '@components/BackBtn';
import { createStructuredSelector } from 'reselect';
import { formatDateWithDay, formatHour, formatOrderDate, formatRupiah } from '@utils/handleValue';
import { getOrder, setOrder } from './actions';

import { selectOrder } from './selectors';

import classes from './style.module.scss';
import OrderedSeatCard from './components/OrderedSeatCard';

const History = ({ order }) => {
  const { orderId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleErrorGetOrder = (errorMsg) => {
    toast.error(errorMsg);
    navigate('/my-tickets');
  };

  useEffect(() => {
    dispatch(getOrder(orderId, handleErrorGetOrder));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (!order) return;

    if (!order.Payment.isPaid) {
      toast.error("Haven't paid this order");
      navigate(`/unpaid/${orderId}`);
    }

    if (new Date(order.Schedule.arrivalTime) >= new Date(new Date().getTime() - 6 * 60 * 60 * 1000)) {
      navigate(`/order/${orderId}`);
    }

    return () => {
      dispatch(setOrder(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/my-tickets')} />
          <h1>History</h1>
        </header>

        <section className={classes.metaData}>
          <div>Order Number: {order?.id}</div>
          <div>
            Order Time: {formatHour(order?.createdAt)} {formatOrderDate(order?.createdAt)}
          </div>
        </section>

        <section>
          <div className={classes.sectionDesc}>
            <div className={classes.row}>
              <div className={classes.dateTime}>{formatDateWithDay(order?.Schedule.departureTime)}</div>
            </div>
            <div className={classes.row}>
              <div className={classes.timeAndPlace}>
                <div className={classes.time}>
                  {formatHour(order?.Schedule.departureTime)}
                  <sup> WIB</sup>
                </div>
                <div className={classes.place}>{order?.Schedule.departureStation.name}</div>
              </div>
              <div className={classes.train}>
                <div className={classes.name}>{order?.Schedule.Train.name}</div>
                <div className={classes.arrowImage}>
                  <img src={arrowImage} alt="" />
                </div>
              </div>
              <div className={classes.timeAndPlace}>
                <div className={classes.time}>
                  {formatHour(order?.Schedule.arrivalTime)}
                  <sup> WIB</sup>
                </div>
                <div className={classes.place}>{order?.Schedule.arrivalStation.name}</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={classes.header}>Passenger</div>
          <hr />
          <div className={classes.sectionDesc}>
            {order?.OrderedSeats.map((orderedSeat, idx) => (
              <OrderedSeatCard
                key={orderedSeat.id}
                orderedSeat={orderedSeat}
                addLine={idx !== order.OrderedSeats.length - 1}
              />
            ))}
          </div>
        </section>

        <section>
          <div className={classes.sectionDesc}>
            <div className={classes.totalPrice}>
              <div>Total Payment Amount</div>
              <div>{formatRupiah(order?.Payment.amount)}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

History.propTypes = {
  order: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  order: selectOrder,
});

export default connect(mapStateToProps)(History);
