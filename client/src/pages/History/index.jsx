import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import arrowImage from '@static/images/arrowTrain.png';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import BackBtn from '@components/BackBtn';
import { createStructuredSelector } from 'reselect';
import { formatDateWithDay, formatHour, formatOrderDate, formatRupiah } from '@utils/handleValue';
import { selectLocale } from '@containers/App/selectors';
import { getOrder, setOrder } from './actions';
import { selectOrder } from './selectors';
import OrderedSeatCard from './components/OrderedSeatCard';

import classes from './style.module.scss';

const History = ({ order, locale, intl: { formatMessage } }) => {
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
      toast.error(formatMessage({ id: 'app_havent_paid_this_order' }));
      navigate(`/unpaid/${orderId}`);
      return;
    }

    if (new Date(order.Schedule.arrivalTime) >= new Date(new Date().getTime() - 6 * 60 * 60 * 1000)) {
      navigate(`/order/${orderId}`);
      return;
    }

    return () => {
      dispatch(setOrder(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  return (
    <main data-testid="History" className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/my-tickets')} />
          <h1>
            <FormattedMessage id="app_history" />
          </h1>
        </header>

        <section className={classes.metaData}>
          <div>
            <FormattedMessage id="app_order_number" />: {order?.id}
          </div>
          <div>
            <FormattedMessage id="app_order_time" />: {formatHour(order?.createdAt)} {formatOrderDate(order?.createdAt)}
          </div>
        </section>

        <section>
          <div className={classes.sectionDesc}>
            <div className={classes.row}>
              <div className={classes.dateTime}>{formatDateWithDay(order?.Schedule.departureTime, locale)}</div>
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
                  <img src="../../static/images/arrowTrain.png" alt="" />
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
          <div className={classes.header}>
            <FormattedMessage id="app_passenger" />
          </div>
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
              <div>
                <FormattedMessage id="app_total_payment_amount" />
              </div>
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
  locale: PropTypes.string.isRequired,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  order: selectOrder,
  locale: selectLocale,
});

export default injectIntl(connect(mapStateToProps)(History));
