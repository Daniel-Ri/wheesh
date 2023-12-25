/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { useNavigate } from 'react-router-dom';
import { formatHour, formatRupiah } from '@utils/handleValue';
import { Button } from '@mui/material';
import { createStructuredSelector } from 'reselect';
import { selectLogin } from '@containers/Client/selectors';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import classes from './style.module.scss';

const ScheduleCard = ({ login, schedule, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);

  const handleClickBook = (seatClass) => {
    // Not adding `return` so the user will be redirected to `/login`
    if (!login) {
      toast.error(formatMessage({ id: 'app_need_to_login' }));
    }

    navigate(`/book/${schedule.id}/${seatClass}`);
  };

  return (
    <div data-testid="ScheduleCard" className={`${classes.card} ${selected ? classes.selected : ''}`}>
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
              <img src="/arrowTrain.png" alt="" />
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
              <div className={classes.available}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {schedule.firstSeatAvailable === 'Available' ? (
                  <FormattedMessage id="app_available" />
                ) : schedule.firstSeatAvailable === 'Few' ? (
                  <FormattedMessage id="app_few" />
                ) : (
                  <FormattedMessage id="app_none" />
                )}
              </div>
            </div>
            <Button
              data-testid="BookFirstSeatButton"
              variant="contained"
              disabled={schedule.firstSeatAvailable === 'None'}
              className={classes.btn}
              onClick={() => handleClickBook('first')}
            >
              <FormattedMessage id="app_book" />
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
              <div className={classes.available}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {schedule.businessSeatAvailable === 'Available' ? (
                  <FormattedMessage id="app_available" />
                ) : schedule.businessSeatAvailable === 'Few' ? (
                  <FormattedMessage id="app_few" />
                ) : (
                  <FormattedMessage id="app_none" />
                )}
              </div>
            </div>
            <Button
              data-testid="BookBusinessSeatButton"
              variant="contained"
              disabled={schedule.businessSeatAvailable === 'None'}
              className={classes.btn}
              onClick={() => handleClickBook('business')}
            >
              <FormattedMessage id="app_book" />
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
              <div className={classes.available}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {schedule.economySeatAvailable === 'Available' ? (
                  <FormattedMessage id="app_available" />
                ) : schedule.economySeatAvailable === 'Few' ? (
                  <FormattedMessage id="app_few" />
                ) : (
                  <FormattedMessage id="app_none" />
                )}
              </div>
            </div>
            <Button
              data-testid="BookEconomySeatButton"
              variant="contained"
              disabled={schedule.economySeatAvailable === 'None'}
              className={classes.btn}
              onClick={() => handleClickBook('economy')}
            >
              <FormattedMessage id="app_book" />
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
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
});

export default injectIntl(connect(mapStateToProps)(ScheduleCard));
