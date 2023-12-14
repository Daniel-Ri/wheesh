import PropTypes from 'prop-types';

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
      <div className={classes.card} onClick={handleClickCard}>
        <div className={classes.leftCard}>
          <div className={classes.name}>{orderedSeat.name}</div>
          <div className={classes.description}>
            <div>ID Card</div>
            <div>{censorIdCard(orderedSeat.idCard)}</div>
          </div>
          <div className={classes.description}>
            <div>Coach {String(orderedSeat.Seat.Carriage.carriageNumber).padStart(2, '0')}</div>
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
            <h2>QR Ticket</h2>
            <img src={imageUrl} alt="" />
            <div className={classes.name}>{orderedSeat.name}</div>
            <div className={classes.description}>
              <div>ID Card</div>
              <div>{censorIdCard(orderedSeat.idCard)}</div>
            </div>
            <div className={classes.description}>
              <div>Coach {String(orderedSeat.Seat.Carriage.carriageNumber).padStart(2, '0')}</div>
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
