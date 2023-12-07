import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import classes from './style.module.scss';

const BackBtn = ({ handleClickBack }) => (
  <Button className={classes.btn} onClick={handleClickBack}>
    Back
  </Button>
);

BackBtn.propTypes = {
  handleClickBack: PropTypes.func.isRequired,
};

export default BackBtn;
