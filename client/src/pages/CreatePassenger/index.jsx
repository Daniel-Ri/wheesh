/* eslint-disable jsx-a11y/label-has-associated-control */
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { useNavigate } from 'react-router-dom';
import BackBtn from '@components/BackBtn';
import { useState } from 'react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import { Button } from '@mui/material';
import { createPassenger } from './actions';

import classes from './style.module.scss';

const CreatePassenger = ({ intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    gender: '',
    dateOfBirth: '',
    idCard: '',
    name: '',
    email: '',
  });

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateIdCard = () => {
    if (!inputs.idCard) {
      toast.error(formatMessage({ id: 'app_must_insert_id_card' }));
      return false;
    }
    if (inputs.idCard.length !== 16 || !/^\d+$/.test(inputs.idCard)) {
      toast.error(formatMessage({ id: 'app_incorrect_id_card_format' }));
      return false;
    }

    return true;
  };

  const validateEmail = () => {
    if (!inputs.email) {
      return true;
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputs.email)) {
      toast.error(formatMessage({ id: 'app_incorrect_email_format' }));
      return false;
    }

    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'idCard') {
      validateIdCard();
    }

    if (e.target.name === 'email') {
      validateEmail();
    }
  };

  const validateInputs = () => {
    if (!validateIdCard()) return false;
    if (!validateEmail()) return false;
    return true;
  };

  const handleSuccess = () => {
    toast.success(formatMessage({ id: 'app_success_add_passenger' }));
    navigate('/myPassengers');
  };

  const handleError = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    const formattedInputs = { ...inputs };
    formattedInputs.dateOfBirth = new Date(inputs.dateOfBirth).toDateString();

    if (!inputs.email) delete formattedInputs.email;

    dispatch(createPassenger(formattedInputs, handleSuccess, handleError));
  };

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/myPassengers')} />
          <h1>
            <FormattedMessage id="app_add_passenger" />
          </h1>
        </header>

        <form>
          <div className={classes.header}>
            <FormattedMessage id="app_personal_information" />
          </div>
          <div className={classes.input}>
            <label htmlFor="gender">
              <FormattedMessage id="app_gender" />
            </label>
            <div className={classes.radios}>
              <div className={classes.radio} onClick={() => setInputs((prev) => ({ ...prev, gender: 'Male' }))}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={inputs.gender === 'Male'}
                  onChange={handleInputChange}
                />
                <label>
                  <FormattedMessage id="app_male" />
                </label>
              </div>
              <div className={classes.radio} onClick={() => setInputs((prev) => ({ ...prev, gender: 'Female' }))}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={inputs.gender === 'Female'}
                  onChange={handleInputChange}
                />
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
            <DatePicker
              name="dateOfBirth"
              placeholderText={formatMessage({ id: 'app_select_the_date_of_birth' })}
              selected={inputs.dateOfBirth}
              showMonthDropdown
              dropdownMode="select"
              showYearDropdown
              dateFormat="dd/MM/yyyy"
              className={classes.datePicker}
              onChange={(date) => setInputs((prev) => ({ ...prev, dateOfBirth: date }))}
            />
          </div>

          <div className={classes.header}>
            <FormattedMessage id="app_certificate_information" />
          </div>
          <div className={classes.input}>
            <label htmlFor="idCard">
              <FormattedMessage id="app_id_card" />
            </label>
            <input
              type="text"
              name="idCard"
              id="idCard"
              value={inputs.idCard}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder={formatMessage({ id: 'app_please_enter_indonesia_id' })}
              autoComplete="off"
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="name">
              <FormattedMessage id="app_name" />
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={inputs.name}
              onChange={handleInputChange}
              placeholder={formatMessage({ id: 'app_enter_name_on_id_card' })}
              autoComplete="off"
            />
          </div>

          <div className={classes.header}>
            <FormattedMessage id="app_contact_information" />
          </div>
          <div className={classes.input}>
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              id="email"
              value={inputs.email}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder={formatMessage({ id: 'app_optional_enter_email_address' })}
              autoComplete="off"
            />
          </div>
        </form>

        <div className={classes.buttons}>
          <Button variant="contained" className={classes.submit} onClick={handleSubmit}>
            <FormattedMessage id="app_submit" />
          </Button>
        </div>
      </div>
    </main>
  );
};

CreatePassenger.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(CreatePassenger);
