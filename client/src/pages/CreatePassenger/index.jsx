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

  const [errors, setErrors] = useState({
    gender: '',
    dateOfBirth: '',
    idCard: '',
    name: '',
    email: '',
  });

  const [mainError, setMainError] = useState('');

  const today = new Date();
  const isDateAvailable = (date) => date <= today;

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateGender = () => {
    if (!inputs.gender) {
      setErrors((prev) => ({ ...prev, gender: formatMessage({ id: 'app_must_choose_gender' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, gender: '' }));
    return true;
  };

  const validateDateOfBirth = () => {
    if (!inputs.dateOfBirth) {
      setErrors((prev) => ({ ...prev, dateOfBirth: formatMessage({ id: 'app_must_choose_date_birth' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
    return true;
  };

  const validateIdCard = () => {
    if (!inputs.idCard) {
      setErrors((prev) => ({ ...prev, idCard: formatMessage({ id: 'app_must_insert_id_card' }) }));
      return false;
    }
    if (inputs.idCard.length !== 16 || !/^\d+$/.test(inputs.idCard)) {
      setErrors((prev) => ({ ...prev, idCard: formatMessage({ id: 'app_incorrect_id_card_format' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, idCard: '' }));
    return true;
  };

  const validateName = () => {
    if (!inputs.name) {
      setErrors((prev) => ({ ...prev, name: formatMessage({ id: 'app_must_insert_name' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, name: '' }));
    return true;
  };

  const validateEmail = () => {
    if (!inputs.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
      return true;
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputs.email)) {
      setErrors((prev) => ({ ...prev, email: formatMessage({ id: 'app_incorrect_email_format' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'dateOfBirth') {
      validateDateOfBirth();
    } else if (e.target.name === 'idCard') {
      validateIdCard();
    } else if (e.target.name === 'name') {
      validateName();
    } else if (e.target.name === 'email') {
      validateEmail();
    }
  };

  const validateInputs = () => {
    const validatedGender = validateGender();
    const validatedDateOfBirth = validateDateOfBirth();
    const validatedIdCard = validateIdCard();
    const validatedName = validateName();
    const validatedEmail = validateEmail();

    if (!validatedGender || !validatedDateOfBirth || !validatedIdCard || !validatedName || !validatedEmail) {
      return false;
    }

    return true;
  };

  const handleSuccess = () => {
    toast.success(formatMessage({ id: 'app_success_add_passenger' }));
    navigate('/myPassengers');
  };

  const handleError = (errorMsg) => {
    setMainError(errorMsg);
  };

  const handleSubmit = () => {
    setErrors({
      gender: '',
      dateOfBirth: '',
      idCard: '',
      name: '',
      email: '',
    });
    setMainError('');
    if (!validateInputs()) return;

    const formattedInputs = { ...inputs };
    formattedInputs.dateOfBirth = new Date(inputs.dateOfBirth).toDateString();

    if (!inputs.email) delete formattedInputs.email;

    dispatch(createPassenger(formattedInputs, handleSuccess, handleError));
  };

  return (
    <main data-testid="CreatePassenger" className={classes.main}>
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
              <div
                className={classes.radio}
                onClick={() => {
                  setInputs((prev) => ({ ...prev, gender: 'Male' }));
                  setErrors((prev) => ({ ...prev, gender: '' }));
                }}
              >
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
              <div
                className={classes.radio}
                onClick={() => {
                  setInputs((prev) => ({ ...prev, gender: 'Female' }));
                  setErrors((prev) => ({ ...prev, gender: '' }));
                }}
              >
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
          {errors.gender && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.gender}</div>
            </div>
          )}

          <div className={classes.input}>
            <label htmlFor="dateOfBirth">
              <FormattedMessage id="app_date_of_birth" />
            </label>
            <div className={classes.datePickerWrapper}>
              <DatePicker
                name="dateOfBirth"
                placeholderText={formatMessage({ id: 'app_select_the_date_of_birth' })}
                selected={inputs.dateOfBirth}
                showMonthDropdown
                dropdownMode="select"
                showYearDropdown
                dateFormat="dd/MM/yyyy"
                filterDate={isDateAvailable}
                className={classes.datePicker}
                onChange={(date) => setInputs((prev) => ({ ...prev, dateOfBirth: date }))}
                onBlur={handleFocusOut}
              />
            </div>
          </div>
          {errors.dateOfBirth && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.dateOfBirth}</div>
            </div>
          )}

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
          {errors.idCard && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.idCard}</div>
            </div>
          )}

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
              onBlur={handleFocusOut}
              placeholder={formatMessage({ id: 'app_enter_name_on_id_card' })}
              autoComplete="off"
            />
          </div>
          {errors.name && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.name}</div>
            </div>
          )}

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
          {errors.email && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.email}</div>
            </div>
          )}
        </form>

        {mainError && <div className={classes.mainError}>{mainError}</div>}

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
