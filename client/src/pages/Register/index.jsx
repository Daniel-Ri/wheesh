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
import { enGB, id } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './custom.css';

import toast from 'react-hot-toast';
import { registerUser, sendEmailToken } from '@containers/Client/actions';
import { createStructuredSelector } from 'reselect';
import { selectLogin } from '@containers/Client/selectors';

import { selectLocale } from '@containers/App/selectors';
import classes from './style.module.scss';

const Register = ({ login, locale, intl: { formatMessage } }) => {
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

  const [errors, setErrors] = useState({
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

  const [mainError, setMainError] = useState('');

  const today = new Date();
  const isDateAvailable = (date) => date <= today;

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
      setErrors((prev) => ({ ...prev, username: formatMessage({ id: 'app_username_cannot_be_empty' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, username: '' }));
    return true;
  };

  const validatePassword = () => {
    if (!inputs.password) {
      setErrors((prev) => ({ ...prev, password: formatMessage({ id: 'app_password_cannot_be_empty' }) }));
      return false;
    }

    if (inputs.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: formatMessage({ id: 'app_password_must_have_characters' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, password: '' }));
    return true;
  };

  const validatePasswordConfirmation = () => {
    if (!inputs.passwordConfirmation) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirmation: formatMessage({ id: 'app_must_insert_password_confirmation' }),
      }));
      return false;
    }
    if (inputs.passwordConfirmation !== inputs.password) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirmation: formatMessage({ id: 'app_password_confirmation_must_same' }),
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, passwordConfirmation: '' }));
    return true;
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
      setErrors((prev) => ({ ...prev, email: formatMessage({ id: 'app_you_must_insert_email' }) }));
      return false;
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputs.email)) {
      setErrors((prev) => ({ ...prev, email: formatMessage({ id: 'app_incorrect_email_format' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const validateEmailToken = () => {
    if (!inputs.emailToken) {
      setErrors((prev) => ({ ...prev, emailToken: formatMessage({ id: 'app_must_insert_verification_code' }) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, emailToken: '' }));
    return true;
  };

  const handleFocusOut = (e) => {
    if (e.target.name === 'username') {
      validateUsername();
    } else if (e.target.name === 'password') {
      validatePassword();
    } else if (e.target.name === 'passwordConfirmation') {
      validatePasswordConfirmation();
    } else if (e.target.name === 'dateOfBirth') {
      validateDateOfBirth();
    } else if (e.target.name === 'idCard') {
      validateIdCard();
    } else if (e.target.name === 'name') {
      validateName();
    } else if (e.target.name === 'email') {
      validateEmail();
    } else if (e.target.name === 'emailToken') {
      validateEmailToken();
    }
  };

  const validateInputs = () => {
    const validatedUsername = validateUsername();
    const validatedPassword = validatePassword();
    const validatedPasswordConfirmation = validatePasswordConfirmation();
    const validatedGender = validateGender();
    const validatedDateOfBirth = validateDateOfBirth();
    const validatedIdCard = validateIdCard();
    const validatedName = validateName();
    const validatedEmail = validateEmail();
    const validatedEmailToken = validateEmailToken();

    if (
      !validatedUsername ||
      !validatedPassword ||
      !validatedPasswordConfirmation ||
      !validatedDateOfBirth ||
      !validatedGender ||
      !validatedIdCard ||
      !validatedName ||
      !validatedEmail ||
      !validatedEmailToken
    ) {
      return false;
    }

    return true;
  };

  const handleSuccessRegister = () => {
    toast.success(formatMessage({ id: 'app_success_registration' }));
    navigate('/login');
  };

  const handleErrorRegister = (errorMsg) => {
    setMainError(errorMsg);
  };

  const handleSubmit = () => {
    setErrors({
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
    setMainError('');
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
    setErrors((prev) => ({ ...prev, email: errorMsg }));
    setInputs((prev) => ({ ...prev, email: '' }));
  };

  const handleGenerateEmailToken = () => {
    if (!validateEmail()) return;
    setInputs((prev) => ({ ...prev, emailToken: '' }));

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
    <main data-testid="Register" className={classes.main}>
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
          {errors.username && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.username}</div>
            </div>
          )}

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
          {errors.password && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.password}</div>
            </div>
          )}

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
          {errors.passwordConfirmation && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.passwordConfirmation}</div>
            </div>
          )}

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
                locale={locale === 'id' ? id : enGB}
                placeholderText={formatMessage({ id: 'app_select_your_date_of_birth' })}
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
              placeholder={formatMessage({ id: 'app_please_enter_your_id' })}
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
              placeholder={formatMessage({ id: 'app_enter_name_on_your_id' })}
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
              placeholder={formatMessage({ id: 'app_please_enter_email_address' })}
              autoComplete="off"
            />
          </div>
          {errors.email && (
            <div className={classes.errorRowReverse}>
              <div className={classes.errorMsg}>{errors.email}</div>
            </div>
          )}

          <div className={classes.input}>
            <input
              className={classes.verification}
              type="text"
              name="emailToken"
              id="emailToken"
              value={inputs.emailToken}
              onChange={handleInputChange}
              onBlur={handleFocusOut}
              placeholder={formatMessage({ id: 'app_please_enter_verification_code' })}
              autoComplete="off"
            />
            <div className={classes.button}>
              <Button variant="contained" className={classes.btn} onClick={handleGenerateEmailToken}>
                <FormattedMessage id="app_generate" />
              </Button>
            </div>
          </div>
          {errors.emailToken && (
            <div className={classes.errorRow}>
              <div className={classes.errorMsg}>{errors.emailToken}</div>
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

Register.propTypes = {
  login: PropTypes.bool,
  locale: PropTypes.string,
  intl: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  locale: selectLocale,
});

export default injectIntl(connect(mapStateToProps)(Register));
