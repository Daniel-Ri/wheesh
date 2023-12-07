import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { censorIdCard } from '@utils/handleValue';
import classes from './style.module.scss';

const PassengerCard = ({ passenger }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.card} onClick={() => navigate(`/passenger/${passenger.id}`)}>
      <div className={classes.leftCard}>
        <div className={classes.name}>{passenger.name}</div>
        <div className={classes.description}>
          <div>ID Card</div>
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
