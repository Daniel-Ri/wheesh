import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const BackBtn = ({ handleClickBack }) => (
  <Button className={classes.btn} onClick={handleClickBack}>
    <FormattedMessage id="app_back" />
  </Button>
);

BackBtn.propTypes = {
  handleClickBack: PropTypes.func.isRequired,
};

export default BackBtn;
