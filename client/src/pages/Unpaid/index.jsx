import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import arrowImage from '@static/images/arrowTrain.png';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BackBtn from '@components/BackBtn';
import { formatDateWithDay, formatHour, formatRupiah } from '@utils/handleValue';
import { Button } from '@mui/material';
import { selectLocale } from '@containers/App/selectors';
import { cancelOrder, getOrder, payOrder, setOrder } from './actions';
import { selectOrder } from './selectors';
import OrderedSeatCard from './components/OrderedSeatCard';

import classes from './style.module.scss';

const Unpaid = ({ order, locale, intl: { formatMessage } }) => {
  const { orderId } = useParams();
  const [countdown, setCountdown] = useState({ minutes: 0, seconds: 0 });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleErrorGetOrder = (errorMsg) => {
    toast.error(errorMsg);
    navigate('/my-tickets');
  };

  const handleErrorCancel = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSuccessCancel = () => {
    toast.success(formatMessage({ id: 'app_success_cancel_the_order' }));
    dispatch(setOrder(null));
    navigate('/my-tickets');
  };

  const handleErrorPay = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSuccessPay = () => {
    toast.success(formatMessage({ id: 'app_success_pay_the_order' }));
    dispatch(setOrder(null));
    navigate(`/order/${orderId}`);
  };

  const handleCancel = () => {
    dispatch(cancelOrder(orderId, handleSuccessCancel, handleErrorCancel));
  };

  const handlePay = () => {
    dispatch(payOrder(orderId, handleSuccessPay, handleErrorPay));
  };

  useEffect(() => {
    dispatch(getOrder(orderId, handleErrorGetOrder));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (!order) return;

    if (order.Payment.isPaid) {
      toast.error(formatMessage({ id: 'app_you_have_paid_order' }));
      navigate('/my-tickets');
    }

    const countdowner = setInterval(() => {
      const now = new Date().getTime();
      const duePayment = new Date(order.Payment.duePayment).getTime();

      if (now > duePayment) {
        toast.error(formatMessage({ id: 'app_passed_payment_due_time' }));
        navigate('/my-tickets');
      }

      const distance = duePayment - now;
      const minutes = Math.floor(distance / (60 * 1000));
      const seconds = Math.floor((distance % (60 * 1000)) / 1000);
      setCountdown({ minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(countdowner);
      dispatch(setOrder(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/my-tickets')} />
          <h1>
            <FormattedMessage id="app_unpaid" />
          </h1>
        </header>

        <div className={classes.countdown}>
          <div className={classes.message}>
            <FormattedMessage id="app_be_paid_remaining_time" />
          </div>
          <div className={classes.time}>
            {countdown.minutes} m {countdown.seconds} s
          </div>
        </div>

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
                <FormattedMessage id="app_total_price" />
              </div>
              <div>{formatRupiah(order?.Payment.amount)}</div>
            </div>
            <div className={classes.buttons}>
              <Button variant="outlined" className={classes.btn} onClick={handleCancel}>
                <FormattedMessage id="app_cancel_order" />
              </Button>
              <Button variant="contained" className={classes.btn} onClick={handlePay}>
                <FormattedMessage id="app_pay" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

Unpaid.propTypes = {
  order: PropTypes.object,
  locale: PropTypes.string.isRequired,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  order: selectOrder,
  locale: selectLocale,
});

export default injectIntl(connect(mapStateToProps)(Unpaid));
