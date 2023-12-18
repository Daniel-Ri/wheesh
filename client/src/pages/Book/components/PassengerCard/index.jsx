import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { censorIdCard } from '@utils/handleValue';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import classes from './style.module.scss';

const PassengerCard = ({ passenger, onClick }) => (
  <>
    <div className={classes.card}>
      <div className={classes.leftCard}>
        <div className={classes.name}>{passenger.name}</div>
        <div className={classes.description}>
          <div>
            <FormattedMessage id="app_id_card" />
          </div>
          <div>{censorIdCard(passenger.idCard)}</div>
        </div>
      </div>
      <IconButton className={classes.iconButton} onClick={onClick}>
        <DeleteIcon />
      </IconButton>
    </div>
    <hr />
  </>
);

PassengerCard.propTypes = {
  passenger: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PassengerCard;
