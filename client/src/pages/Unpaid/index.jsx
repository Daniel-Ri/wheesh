import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

import arrowImage from '@static/images/arrowTrain.png';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BackBtn from '@components/BackBtn';
import { formatDateWithDay, formatHour, formatRupiah } from '@utils/handleValue';
import { Button } from '@mui/material';
import classes from './style.module.scss';
import { cancelOrder, getOrder, payOrder, setOrder } from './actions';
import { selectOrder } from './selectors';
import OrderedSeatCard from './components/OrderedSeatCard';

const Unpaid = ({ order }) => {
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
    toast.success('Success cancel the order');
    dispatch(setOrder(null));
    navigate('/my-tickets');
  };

  const handleErrorPay = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSuccessPay = () => {
    toast.success('Success pay the order');
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
      toast.error('You have paid the order');
      navigate('/my-tickets');
    }

    const countdowner = setInterval(() => {
      const now = new Date().getTime();
      const duePayment = new Date(order.Payment.duePayment).getTime();

      if (now > duePayment) {
        toast.error('Passed payment due time');
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
          <h1>Unpaid</h1>
        </header>

        <div className={classes.countdown}>
          <div className={classes.message}>To be paid, remaining time:</div>
          <div className={classes.time}>
            {countdown.minutes} m {countdown.seconds} s
          </div>
        </div>

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
              <div>Total Price</div>
              <div>{formatRupiah(order?.Payment.amount)}</div>
            </div>
            <div className={classes.buttons}>
              <Button variant="outlined" className={classes.btn} onClick={handleCancel}>
                Cancel Order
              </Button>
              <Button variant="contained" className={classes.btn} onClick={handlePay}>
                Pay
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
};

const mapStateToProps = createStructuredSelector({
  order: selectOrder,
});

export default connect(mapStateToProps)(Unpaid);
