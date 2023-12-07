/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import classes from './style.module.scss';

const NonEditable = ({ passenger }) => (
  <div className={classes.nonEditable}>
    <form>
      <div className={classes.header}>Personal Information</div>
      <div className={classes.input}>
        <label htmlFor="gender">Gender</label>
        <div className={classes.radios}>
          <div className={classes.radio}>
            <input type="radio" name="gender" value="Male" disabled checked={passenger.gender === 'Male'} />
            <label>Male</label>
          </div>
          <div className={classes.radio}>
            <input type="radio" name="gender" value="Female" disabled checked={passenger.gender === 'Female'} />
            <label>Female</label>
          </div>
        </div>
      </div>
      <div className={classes.input}>
        <label htmlFor="dateOfBirth">Date of birth</label>
        <DatePicker
          name="dateOfBirth"
          placeholderText="Select your date of birth"
          selected={new Date(passenger.dateOfBirth)}
          showMonthDropdown
          dropdownMode="select"
          showYearDropdown
          dateFormat="dd/MM/yyyy"
          className={classes.datePicker}
          disabled
        />
      </div>

      <div className={classes.header}>Certificate Information</div>
      <div className={classes.input}>
        <label htmlFor="idCard">ID Card</label>
        <input
          type="text"
          name="idCard"
          id="idCard"
          value={passenger.idCard}
          placeholder="Please enter Indonesia ID card"
          autoComplete="off"
          disabled
        />
      </div>
      <div className={classes.input}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={passenger.name}
          placeholder="Enter the name on your ID Card"
          autoComplete="off"
          disabled
        />
      </div>

      <div className={classes.header}>Contact Information</div>
      <div className={classes.input}>
        <label htmlFor="email">E-mail</label>
        <input
          type="text"
          name="email"
          id="email"
          value={passenger.email}
          placeholder="(Optional) Enter the email address"
          autoComplete="off"
          disabled
        />
      </div>
    </form>
  </div>
);

NonEditable.propTypes = {
  passenger: PropTypes.object.isRequired,
};

export default NonEditable;
