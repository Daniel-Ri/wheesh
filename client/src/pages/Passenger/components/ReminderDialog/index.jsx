import PropTypes from 'prop-types';

import { Button, Dialog } from '@mui/material';
import classes from './style.module.scss';

const ReminderDialog = ({ open, handleClose, handleDelete }) => (
  <Dialog open={open} onClose={handleClose}>
    <div className={classes.dialog}>
      <div className={classes.content}>
        <h2>Verification</h2>
        <div className={classes.message}>Are you sure about deleting the passenger?</div>
      </div>
      <div className={classes.buttons}>
        <Button variant="outlined" className={classes.cancel} onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" className={classes.confirm} onClick={handleDelete}>
          Confirm
        </Button>
      </div>
    </div>
  </Dialog>
);

ReminderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default ReminderDialog;
