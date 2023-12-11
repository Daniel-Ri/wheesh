/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
import { formatHour, formatRupiah } from '@utils/handleValue';
import arrowImage from '@static/images/arrowTrain.png';
import classes from './style.module.scss';

const ScheduleCard = ({ schedule }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.card}>
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
  );
};

ScheduleCard.propTypes = {
  schedule: PropTypes.object.isRequired,
};

export default ScheduleCard;
