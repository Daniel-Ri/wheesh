import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { censorIdCard } from '@utils/handleValue';
import classes from './style.module.scss';

const PassengerCard = ({ passenger }) => {
  const navigate = useNavigate();

  return (
    <div data-testid="PassengerCard" className={classes.card} onClick={() => navigate(`/passenger/${passenger.id}`)}>
      <div className={classes.leftCard}>
        <div className={classes.name}>{passenger.name}</div>
        <div className={classes.description}>
          <div>
            <FormattedMessage id="app_id_card" />
          </div>
          <div>{censorIdCard(passenger.idCard)}</div>
        </div>
      </div>
      <VisibilityIcon />
    </div>
  );
};

PassengerCard.propTypes = {
  passenger: PropTypes.object.isRequired,
};

export default PassengerCard;
