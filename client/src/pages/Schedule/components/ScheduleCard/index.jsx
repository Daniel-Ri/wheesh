/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
import { formatHour, formatRupiah } from '@utils/handleValue';
import arrowImage from '@static/images/arrowTrain.png';
import { Button } from '@mui/material';
import { createStructuredSelector } from 'reselect';
import { selectLogin } from '@containers/Client/selectors';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import classes from './style.module.scss';

const ScheduleCard = ({ login, schedule }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);

  const handleClickBook = (seatClass) => {
    if (!login) {
      toast.error('You need to login');
    }

    navigate(`/book/${schedule.id}/${seatClass}`);
  };

  return (
    <div className={`${classes.card} ${selected ? classes.selected : ''}`}>
      <div className={classes.topCard} onClick={() => setSelected((isSelected) => !isSelected)}>
        <div className={classes.leftCard}>
          <div className={classes.timeAndPlace}>
            <div className={classes.time}>
              {formatHour(schedule.departureTime)}
              <sup> WIB</sup>
            </div>
            <div className={classes.place}>{schedule.departureStation.name}</div>
          </div>
          <div className={classes.train}>
            <div className={classes.name}>{schedule.Train.name}</div>
            <div className={classes.arrowImage}>
              <img src={arrowImage} alt="" />
            </div>
          </div>
          <div className={classes.timeAndPlace}>
            <div className={classes.time}>
              {formatHour(schedule.arrivalTime)}
              <sup> WIB</sup>
            </div>
            <div className={classes.place}>{schedule.arrivalStation.name}</div>
          </div>
        </div>
        <div className={classes.price}>
          {formatRupiah(schedule.prices.filter((schedulePrice) => schedulePrice.seatClass === 'economy')[0].price)}
        </div>
      </div>
      <div className={classes.bottomCard}>
        <div className={classes.seatClass}>
          <div className={classes.nameClass}>First Class</div>
          <div className={classes.rightCard}>
            <div className={classes.priceAndAvailable}>
              <div className={classes.price}>
                {formatRupiah(schedule.prices.filter((schedulePrice) => schedulePrice.seatClass === 'first')[0].price)}
              </div>
              <div className={classes.available}>{schedule.firstSeatAvailable}</div>
            </div>
            <Button
              variant="contained"
              disabled={schedule.firstSeatAvailable === 'None'}
              className={classes.btn}
              onClick={() => handleClickBook('first')}
            >
              Book
            </Button>
          </div>
        </div>
        <hr />
        <div className={classes.seatClass}>
          <div className={classes.nameClass}>Business Class</div>
          <div className={classes.rightCard}>
            <div className={classes.priceAndAvailable}>
              <div className={classes.price}>
                {formatRupiah(
                  schedule.prices.filter((schedulePrice) => schedulePrice.seatClass === 'business')[0].price
                )}
              </div>
              <div className={classes.available}>{schedule.businessSeatAvailable}</div>
            </div>
            <Button
              variant="contained"
              disabled={schedule.businessSeatAvailable === 'None'}
              className={classes.btn}
              onClick={() => handleClickBook('business')}
            >
              Book
            </Button>
          </div>
        </div>
        <hr />
        <div className={classes.seatClass}>
          <div className={classes.nameClass}>Economy Class</div>
          <div className={classes.rightCard}>
            <div className={classes.priceAndAvailable}>
              <div className={classes.price}>
                {formatRupiah(
                  schedule.prices.filter((schedulePrice) => schedulePrice.seatClass === 'economy')[0].price
                )}
              </div>
              <div className={classes.available}>{schedule.economySeatAvailable}</div>
            </div>
            <Button
              variant="contained"
              disabled={schedule.economySeatAvailable === 'None'}
              className={classes.btn}
              onClick={() => handleClickBook('economy')}
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ScheduleCard.propTypes = {
  schedule: PropTypes.object.isRequired,
  login: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
});

export default connect(mapStateToProps)(ScheduleCard);
