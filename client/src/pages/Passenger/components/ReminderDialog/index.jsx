import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Dialog } from '@mui/material';

import classes from './style.module.scss';

const ReminderDialog = ({ open, handleClose, handleDelete }) => (
  <Dialog data-testid="ReminderDialog" open={open} onClose={handleClose}>
    <div className={classes.dialog}>
      <div className={classes.content}>
        <h2>
          <FormattedMessage id="app_verification" />
        </h2>
        <div className={classes.message}>
          <FormattedMessage id="app_sure_deleting_the_passenger" />
        </div>
      </div>
      <div className={classes.buttons}>
        <Button data-testid="CancelButton" variant="outlined" className={classes.cancel} onClick={handleClose}>
          <FormattedMessage id="app_cancel" />
        </Button>
        <Button data-testid="ConfirmButton" variant="contained" className={classes.confirm} onClick={handleDelete}>
          <FormattedMessage id="app_confirm" />
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
