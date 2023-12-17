/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import BackBtn from '@components/BackBtn';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import toast from 'react-hot-toast';
import { registerUser, sendEmailToken } from '@containers/Client/actions';
import { createStructuredSelector } from 'reselect';
import { selectLogin } from '@containers/Client/selectors';

import classes from './style.module.scss';

const Register = ({ login, intl: { formatMessage } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
    gender: '',
    dateOfBirth: '',
    idCard: '',
    name: '',
    email: '',
    emailToken: '',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfirmation = () => setShowPasswordConfirmation((show) => !show);

  const handleMouseDownPasswordConfirmation = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateUsername = () => {
    if (!inputs.username) {
      toast.error(formatMessage({ id: 'app_username_cannot_be_empty' }));
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (!inputs.password) {
      toast.error(formatMessage({ id: 'app_password_cannot_be_empty' }));
      return false;
    }

    if (inputs.password.length < 6) {
      toast.error(formatMessage({ id: 'app_password_must_have_characters' }));
      return false;
    }

    return true;
  };

  const validatePasswordConfirmation = () => {
    if (!inputs.passwordConfirmation) {
      toast.error(formatMessage({ id: 'app_must_insert_password_confirmation' }));
      return false;
    }
    if (inputs.passwordConfirmation !== inputs.password) {
      toast.error(formatMessage({ id: 'app_password_confirmation_must_same' }));
      return false;
    }

    return true;
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
      toast.error(formatMessage({ id: 'app_you_must_insert_email' }));
      return false;
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputs.email)) {
      toast.error(formatMessage({ id: 'app_incorrect_email_format' }));
      return false;
    }

    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'username') {
      validateUsername();
    } else if (e.target.name === 'password') {
      validatePassword();
    } else if (e.target.name === 'passwordConfirmation') {
      validatePasswordConfirmation();
    } else if (e.target.name === 'idCard') {
      validateIdCard();
    } else if (e.target.name === 'email') {
      validateEmail();
    }
  };

  const validateInputs = () => {
    if (!validateUsername()) return false;

    if (!validatePassword()) return false;

    if (!validatePasswordConfirmation()) return false;

    if (!validateIdCard()) return false;

    if (!validateEmail()) return false;

    return true;
  };

  const handleSuccessRegister = () => {
    toast.success(formatMessage({ id: 'app_success_registration' }));
    navigate('/login');
  };

  const handleErrorRegister = (errorMsg) => {
    toast.error(errorMsg);
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    const formattedInputs = { ...inputs };
    formattedInputs.dateOfBirth = new Date(inputs.dateOfBirth).toDateString();
    delete formattedInputs.passwordConfirmation;

    dispatch(registerUser(formattedInputs, handleSuccessRegister, handleErrorRegister));
  };

  const handleSuccessSendEmailToken = () => {
    toast.success(formatMessage({ id: 'app_sent_a_token_email' }));
  };

  const handleErrorSendEmailToken = (errorMsg) => {
    toast.error(errorMsg);
    setInputs((prev) => ({ ...prev, email: '' }));
  };

  const handleGenerateEmailToken = () => {
    if (!validateEmail()) return;

    const formattedInputs = { email: inputs.email, action: 'create' };
    dispatch(sendEmailToken(formattedInputs, handleSuccessSendEmailToken, handleErrorSendEmailToken));
  };

  useEffect(() => {
    if (login) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <header>
          <BackBtn handleClickBack={() => navigate('/login')} />
          <h1>Register</h1>
        </header>

        <form>
          <div className={classes.header}>
            <FormattedMessage id="app_personal_information" />
          </div>
          <div className={classes.input}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={inputs.username}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder={formatMessage({ id: 'app_enter_the_username' })}
              autoComplete="off"
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="password">Password</label>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              placeholder={formatMessage({ id: 'app_enter_the_password' })}
              value={inputs.password}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              className={classes.inputPassword}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label=""
            />
          </div>
          <div className={classes.input}>
            <label htmlFor="passwordConfirmation">
              <FormattedMessage id="app_password_confirmation" />
            </label>
            <OutlinedInput
              id="outlined-adornment-password"
              name="passwordConfirmation"
              placeholder={formatMessage({ id: 'app_enter_password_confirmation' })}
              value={inputs.passwordConfirmation}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              className={classes.inputPassword}
              type={showPasswordConfirmation ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirmation}
                    onMouseDown={handleMouseDownPasswordConfirmation}
                    edge="end"
                  >
                    {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label=""
            />
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
              placeholderText={formatMessage({ id: 'app_select_your_date_of_birth' })}
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
              placeholder={formatMessage({ id: 'app_please_enter_your_id' })}
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
              placeholder={formatMessage({ id: 'app_enter_name_on_your_id' })}
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
              placeholder={formatMessage({ id: 'app_please_enter_email_address' })}
              autoComplete="off"
            />
          </div>
          <div className={classes.input}>
            <input
              className={classes.verification}
              type="text"
              name="emailToken"
              id="emailToken"
              value={inputs.emailToken}
              onChange={handleInputChange}
              placeholder={formatMessage({ id: 'app_please_enter_verification_code' })}
              autoComplete="off"
            />
            <div className={classes.button}>
              <Button variant="contained" className={classes.btn} onClick={handleGenerateEmailToken}>
                <FormattedMessage id="app_generate" />
              </Button>
            </div>
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

Register.propTypes = {
  login: PropTypes.bool,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
});

export default injectIntl(connect(mapStateToProps)(Register));
