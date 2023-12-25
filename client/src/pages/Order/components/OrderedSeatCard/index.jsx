import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import QRCode from 'qrcode';
import { censorIdCard, formatRupiah } from '@utils/handleValue';
import { useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import classes from './style.module.scss';

const OrderedSeatCard = ({ orderedSeat, addLine }) => {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickCard = () => {
    setOpen(true);
  };

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const text = JSON.stringify({ id: orderedSeat.id, secret: orderedSeat.secret });
        const response = await QRCode.toDataURL(text);
        setImageUrl(response);
      } catch (error) {
        // error
      }
    };

    if (open) generateQrCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <div data-testid="OrderedSeatCard" className={classes.card} onClick={handleClickCard}>
        <div className={classes.leftCard}>
          <div className={classes.name}>{orderedSeat.name}</div>
          <div className={classes.description}>
            <div>
              <FormattedMessage id="app_id_card" />
            </div>
            <div>{censorIdCard(orderedSeat.idCard)}</div>
          </div>
          <div className={classes.description}>
            <div>
              <FormattedMessage id="app_coach" /> {String(orderedSeat.Seat.Carriage.carriageNumber).padStart(2, '0')}
            </div>
            <div>|</div>
            <div className={classes.seatClass}>{orderedSeat.Seat.seatClass} class</div>
            <div>{orderedSeat.Seat.seatNumber}</div>
          </div>
        </div>
        <div className={classes.price}>{formatRupiah(orderedSeat.price)}</div>
      </div>
      {addLine && <hr />}

      <Dialog open={open} onClose={handleClose}>
        <div className={classes.dialog}>
          <div className={classes.content}>
            <h2>
              <FormattedMessage id="app_qr_ticket" />
            </h2>
            <img src={imageUrl} alt="" />
            <div className={classes.name}>{orderedSeat.name}</div>
            <div className={classes.description}>
              <div>
                <FormattedMessage id="app_id_card" />
              </div>
              <div>{censorIdCard(orderedSeat.idCard)}</div>
            </div>
            <div className={classes.description}>
              <div>
                <FormattedMessage id="app_coach" /> {String(orderedSeat.Seat.Carriage.carriageNumber).padStart(2, '0')}
              </div>
              <div>|</div>
              <div className={classes.seatClass}>{orderedSeat.Seat.seatClass} class</div>
              <div>{orderedSeat.Seat.seatNumber}</div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

OrderedSeatCard.propTypes = {
  orderedSeat: PropTypes.object.isRequired,
  addLine: PropTypes.bool,
};

export default OrderedSeatCard;
