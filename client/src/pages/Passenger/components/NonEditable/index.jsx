/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import classes from './style.module.scss';

const NonEditable = ({ passenger }) => (
  <div className={classes.nonEditable}>
    <form>
      <div className={classes.header}>
        <FormattedMessage id="app_personal_information" />
      </div>
      <div className={classes.input}>
        <label htmlFor="gender">
          <FormattedMessage id="app_gender" />
        </label>
        <div className={classes.radios}>
          <div className={classes.radio}>
            <input type="radio" name="gender" value="Male" disabled checked={passenger.gender === 'Male'} />
            <label>
              <FormattedMessage id="app_male" />
            </label>
          </div>
          <div className={classes.radio}>
            <input type="radio" name="gender" value="Female" disabled checked={passenger.gender === 'Female'} />
            <label>
              <FormattedMessage id="app_female" />
            </label>
          </div>
        </div>
      </div>
      <div className={classes.input}>
        <label htmlFor="dateOfBirth">
          <FormattedMessage id="app_date_of_birth" />
        </label>
        <div className={classes.datePickerWrapper}>
          <DatePicker
            name="dateOfBirth"
            selected={new Date(passenger.dateOfBirth)}
            dateFormat="dd/MM/yyyy"
            className={classes.datePicker}
            disabled
          />
        </div>
      </div>

      <div className={classes.header}>
        <FormattedMessage id="app_certificate_information" />
      </div>
      <div className={classes.input}>
        <label htmlFor="idCard">
          <FormattedMessage id="app_id_card" />
        </label>
        <input type="text" name="idCard" id="idCard" value={passenger.idCard} autoComplete="off" disabled />
      </div>
      <div className={classes.input}>
        <label htmlFor="name">
          <FormattedMessage id="app_name" />
        </label>
        <input type="text" name="name" id="name" value={passenger.name} autoComplete="off" disabled />
      </div>

      <div className={classes.header}>
        <FormattedMessage id="app_contact_information" />
      </div>
      <div className={classes.input}>
        <label htmlFor="email">E-mail</label>
        <input type="text" name="email" id="email" value={passenger.email} autoComplete="off" disabled />
      </div>
    </form>
  </div>
);

NonEditable.propTypes = {
  passenger: PropTypes.object.isRequired,
};

export default NonEditable;
